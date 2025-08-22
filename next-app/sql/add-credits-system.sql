-- Add credits system to the profiles table
-- This adds a credits field with default 40 credits for new users

-- Add credits column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits integer DEFAULT 40;

-- Update existing users to have 40 credits (if they don't have credits yet)
UPDATE public.profiles 
SET credits = 40 
WHERE credits IS NULL;

-- Make sure admins have unlimited credits (set to a very high number)
UPDATE public.profiles 
SET credits = 999999 
WHERE is_admin = true;

-- Create a function to deduct credits safely
CREATE OR REPLACE FUNCTION deduct_credits(user_id uuid, amount integer)
RETURNS TABLE(success boolean, remaining_credits integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
  user_is_admin boolean;
BEGIN
  -- Get current credits and admin status
  SELECT credits, is_admin 
  INTO current_credits, user_is_admin
  FROM public.profiles 
  WHERE id = user_id;
  
  -- Check if user exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'User not found'::text;
    RETURN;
  END IF;
  
  -- Admins have unlimited credits
  IF user_is_admin THEN
    RETURN QUERY SELECT true, 999999, 'Admin - unlimited credits'::text;
    RETURN;
  END IF;
  
  -- Check if user has enough credits
  IF current_credits < amount THEN
    RETURN QUERY SELECT false, current_credits, 'Insufficient credits'::text;
    RETURN;
  END IF;
  
  -- Deduct credits
  UPDATE public.profiles 
  SET credits = credits - amount,
      updated_at = now()
  WHERE id = user_id;
  
  -- Return success with remaining credits
  SELECT credits INTO current_credits FROM public.profiles WHERE id = user_id;
  RETURN QUERY SELECT true, current_credits, 'Credits deducted successfully'::text;
END;
$$;

-- Create a function to add credits (for purchases, rewards, etc.)
CREATE OR REPLACE FUNCTION add_credits(user_id uuid, amount integer)
RETURNS TABLE(success boolean, new_total integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
  user_is_admin boolean;
BEGIN
  -- Get current credits and admin status
  SELECT credits, is_admin 
  INTO current_credits, user_is_admin
  FROM public.profiles 
  WHERE id = user_id;
  
  -- Check if user exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'User not found'::text;
    RETURN;
  END IF;
  
  -- Don't add credits to admins (they already have unlimited)
  IF user_is_admin THEN
    RETURN QUERY SELECT true, 999999, 'Admin already has unlimited credits'::text;
    RETURN;
  END IF;
  
  -- Add credits
  UPDATE public.profiles 
  SET credits = credits + amount,
      updated_at = now()
  WHERE id = user_id;
  
  -- Return success with new total
  SELECT credits INTO current_credits FROM public.profiles WHERE id = user_id;
  RETURN QUERY SELECT true, current_credits, 'Credits added successfully'::text;
END;
$$;

-- Create a trigger to ensure new users get default credits
CREATE OR REPLACE FUNCTION ensure_default_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set default credits if not specified
  IF NEW.credits IS NULL THEN
    NEW.credits := 40;
  END IF;
  
  -- If user is admin, give unlimited credits
  IF NEW.is_admin = true THEN
    NEW.credits := 999999;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new profile insertions
DROP TRIGGER IF EXISTS trigger_ensure_default_credits ON public.profiles;
CREATE TRIGGER trigger_ensure_default_credits
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION ensure_default_credits();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION deduct_credits TO authenticated;
GRANT EXECUTE ON FUNCTION add_credits TO authenticated;

-- Create an index for faster credit queries
CREATE INDEX IF NOT EXISTS idx_profiles_credits ON public.profiles(credits);

-- Optional: Create a credits transaction log table for audit purposes
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL, -- Positive for additions, negative for deductions
  transaction_type text NOT NULL, -- 'generation', 'purchase', 'reward', 'admin_adjustment'
  description text,
  created_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS on credit transactions
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own transactions
CREATE POLICY "Users can view own credit transactions"
  ON public.credit_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Only system/admin can insert transactions (this will be done via functions)
CREATE POLICY "System can insert credit transactions"
  ON public.credit_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (false); -- Prevent direct inserts, use functions instead

-- Function to log credit transactions
CREATE OR REPLACE FUNCTION log_credit_transaction(
  user_id uuid, 
  amount integer, 
  transaction_type text, 
  description text DEFAULT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  transaction_id uuid;
BEGIN
  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description, metadata)
  VALUES (user_id, amount, transaction_type, description, metadata)
  RETURNING id INTO transaction_id;
  
  RETURN transaction_id;
END;
$$;

-- Update the deduct_credits function to log transactions
CREATE OR REPLACE FUNCTION deduct_credits(user_id uuid, amount integer, description text DEFAULT 'AI Generation')
RETURNS TABLE(success boolean, remaining_credits integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
  user_is_admin boolean;
  transaction_id uuid;
BEGIN
  -- Get current credits and admin status
  SELECT credits, is_admin 
  INTO current_credits, user_is_admin
  FROM public.profiles 
  WHERE id = user_id;
  
  -- Check if user exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'User not found'::text;
    RETURN;
  END IF;
  
  -- Admins have unlimited credits
  IF user_is_admin THEN
    -- Log the transaction for admins too (with 0 cost)
    SELECT log_credit_transaction(user_id, 0, 'generation', 'Admin generation - unlimited credits') INTO transaction_id;
    RETURN QUERY SELECT true, 999999, 'Admin - unlimited credits'::text;
    RETURN;
  END IF;
  
  -- Check if user has enough credits
  IF current_credits < amount THEN
    RETURN QUERY SELECT false, current_credits, 'Insufficient credits'::text;
    RETURN;
  END IF;
  
  -- Deduct credits
  UPDATE public.profiles 
  SET credits = credits - amount,
      updated_at = now()
  WHERE id = user_id;
  
  -- Log the transaction
  SELECT log_credit_transaction(user_id, -amount, 'generation', description) INTO transaction_id;
  
  -- Return success with remaining credits
  SELECT credits INTO current_credits FROM public.profiles WHERE id = user_id;
  RETURN QUERY SELECT true, current_credits, 'Credits deducted successfully'::text;
END;
$$;