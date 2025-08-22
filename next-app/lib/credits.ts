import { createClient } from '@/lib/supabase/client'

export const GENERATION_COST = 40 // Cost per AI generation

export interface CreditResult {
  success: boolean
  remainingCredits: number
  message: string
}

/**
 * Check if user has enough credits for a generation
 */
export async function checkCredits(userId: string): Promise<CreditResult> {
  const supabase = createClient()
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits, is_admin')
      .eq('id', userId)
      .single()

    if (error) {
      return {
        success: false,
        remainingCredits: 0,
        message: 'Error fetching user credits'
      }
    }

    // Admins have unlimited credits
    if (profile.is_admin) {
      return {
        success: true,
        remainingCredits: 999999,
        message: 'Admin - unlimited credits'
      }
    }

    const hasEnoughCredits = profile.credits >= GENERATION_COST
    
    return {
      success: hasEnoughCredits,
      remainingCredits: profile.credits,
      message: hasEnoughCredits ? 'Sufficient credits' : 'Insufficient credits'
    }
  } catch (error) {
    return {
      success: false,
      remainingCredits: 0,
      message: 'Error checking credits'
    }
  }
}

/**
 * Deduct credits for a generation (with security check)
 */
export async function deductCredits(userId: string, description: string = 'AI Generation'): Promise<CreditResult> {
  const supabase = createClient()
  
  try {
    // Call the secure database function
    const { data, error } = await supabase.rpc('deduct_credits', {
      user_id: userId,
      amount: GENERATION_COST,
      description: description
    })

    if (error) {
      console.error('Error deducting credits:', error)
      return {
        success: false,
        remainingCredits: 0,
        message: 'Error deducting credits'
      }
    }

    const result = data[0]
    return {
      success: result.success,
      remainingCredits: result.remaining_credits,
      message: result.message
    }
  } catch (error) {
    console.error('Error in deductCredits:', error)
    return {
      success: false,
      remainingCredits: 0,
      message: 'Error processing credit deduction'
    }
  }
}

/**
 * Add credits to a user account
 */
export async function addCredits(userId: string, amount: number): Promise<CreditResult> {
  const supabase = createClient()
  
  try {
    // Call the secure database function
    const { data, error } = await supabase.rpc('add_credits', {
      user_id: userId,
      amount: amount
    })

    if (error) {
      console.error('Error adding credits:', error)
      return {
        success: false,
        remainingCredits: 0,
        message: 'Error adding credits'
      }
    }

    const result = data[0]
    return {
      success: result.success,
      remainingCredits: result.new_total,
      message: result.message
    }
  } catch (error) {
    console.error('Error in addCredits:', error)
    return {
      success: false,
      remainingCredits: 0,
      message: 'Error processing credit addition'
    }
  }
}

/**
 * Get current credit balance
 */
export async function getCreditBalance(userId: string): Promise<number> {
  const supabase = createClient()
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits, is_admin')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return 0
    }

    // Admins have unlimited credits
    if (profile.is_admin) {
      return 999999
    }

    return profile.credits || 0
  } catch (error) {
    console.error('Error getting credit balance:', error)
    return 0
  }
}