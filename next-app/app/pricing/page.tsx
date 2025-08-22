"use client"

import { AeroplanarPricingCard } from "@/components/ui/aeroplanar-pricing"
import { Footer } from "@/components/landing/footer"
import { Spotlight } from "@/components/ui/spotlight-new"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Home, Users, Star, HelpCircle, DollarSign, Settings, Sparkles, Download, Upload, Share, Eye, Building, Layers } from "lucide-react"
import { toast } from "sonner"

export default function PricingPage() {
  const handleGetStarted = () => {
    toast.success("Redirecting to sign up...")
    // In a real app, you'd redirect to sign up
    setTimeout(() => {
      window.location.href = '/sign-up'
    }, 1000)
  }

  const handleBuyCredits = () => {
    toast.info("Payment system coming soon! Contact support for now.")
    // This is where you'd integrate payment
  }

  const handleContactUs = () => {
    toast.success("Redirecting to contact form...")
    // In a real app, you'd redirect to contact or open email
    setTimeout(() => {
      window.location.href = 'mailto:contact@aeroplanar.com?subject=Company Plan Inquiry'
    }, 1000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000208' }}>
      <NavBar items={[
        { name: "Home", url: "/#hero", icon: Home },
        { name: "Testimonials", url: "/#testimonials", icon: Users },
        { name: "About", url: "/#about", icon: Star },
        { name: "FAQ", url: "/#faq", icon: HelpCircle },
        { name: "Pricing", url: "/pricing", icon: DollarSign },
        { name: "Studio", url: "/studio", icon: Settings },
      ]} />
      <Spotlight />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        <div className="pt-20 pb-12 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Simple{" "}
              <span className="bg-gradient-to-r from-[#c3b383] to-[#d4c496] bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start creating amazing 3D models with our AI-powered studio. Choose the plan that fits your needs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:gap-6 lg:grid-cols-3 max-w-7xl mx-auto">
          {/* Free Plan */}
          <AeroplanarPricingCard
            tier="Free Plan"
            price="$0"
            period="/forever"
            bestFor="Perfect for getting started"
            CTA="Get Started Free"
            onClick={handleGetStarted}
            benefits={[
              { 
                text: "Access to Studio", 
                checked: true, 
                icon: <Building className="h-4 w-4" /> 
              },
              { 
                text: "1 Generation per Month", 
                checked: true, 
                icon: <Sparkles className="h-4 w-4" /> 
              },
              { 
                text: "Mockup Uploading", 
                checked: true, 
                icon: <Upload className="h-4 w-4" /> 
              },
              { 
                text: "Mockup Sharing", 
                checked: true, 
                icon: <Share className="h-4 w-4" /> 
              },
              { 
                text: "Mockup Preview", 
                checked: true, 
                icon: <Eye className="h-4 w-4" /> 
              },
              { 
                text: "Scene Download", 
                checked: false, 
                icon: <Download className="h-4 w-4" /> 
              },
              { 
                text: "Scene Upload", 
                checked: false, 
                icon: <Upload className="h-4 w-4" /> 
              },
              { 
                text: "Unlimited Generations", 
                checked: false, 
                icon: <Sparkles className="h-4 w-4" /> 
              },
            ]}
          />

          {/* Pro Plan */}
          <AeroplanarPricingCard
            tier="Pro Plan"
            price="$30"
            period="/month"
            bestFor="Perfect for professionals"
            CTA="Subscribe to Pro"
            featured={true}
            onClick={handleBuyCredits}
            benefits={[
              { 
                text: "Everything in Free", 
                checked: true, 
                icon: <Star className="h-4 w-4" /> 
              },
              { 
                text: "Model Browser Download", 
                checked: true, 
                icon: <Download className="h-4 w-4" /> 
              },
              { 
                text: "1000 Tokens Included", 
                checked: true, 
                icon: <Sparkles className="h-4 w-4" /> 
              },
              { 
                text: "$1 = 100 Additional Credits", 
                checked: true, 
                icon: <DollarSign className="h-4 w-4" /> 
              },
              { 
                text: "Studio Unlimited Features", 
                checked: true, 
                icon: <Building className="h-4 w-4" /> 
              },
              { 
                text: "Scene Upload", 
                checked: true, 
                icon: <Upload className="h-4 w-4" /> 
              },
              { 
                text: "Unlimited Mockups", 
                checked: true, 
                icon: <Layers className="h-4 w-4" /> 
              },
              { 
                text: "Priority Support", 
                checked: true, 
                icon: <Users className="h-4 w-4" /> 
              },
            ]}
          />

          {/* Company Plan */}
          <AeroplanarPricingCard
            tier="Company Plan"
            price="Custom"
            bestFor="Personalized pricing for your business"
            CTA="Contact Us"
            onClick={handleContactUs}
            benefits={[
              { 
                text: "Everything in Pro", 
                checked: true, 
                icon: <Star className="h-4 w-4" /> 
              },
              { 
                text: "Custom Token Packages", 
                checked: true, 
                icon: <Sparkles className="h-4 w-4" /> 
              },
              { 
                text: "Volume Discounts", 
                checked: true, 
                icon: <DollarSign className="h-4 w-4" /> 
              },
              { 
                text: "Team Management", 
                checked: true, 
                icon: <Users className="h-4 w-4" /> 
              },
              { 
                text: "Dedicated Support", 
                checked: true, 
                icon: <Building className="h-4 w-4" /> 
              },
              { 
                text: "Custom Integrations", 
                checked: true, 
                icon: <Share className="h-4 w-4" /> 
              },
              { 
                text: "SLA Agreements", 
                checked: true, 
                icon: <Eye className="h-4 w-4" /> 
              },
              { 
                text: "Training & Onboarding", 
                checked: true, 
                icon: <Layers className="h-4 w-4" /> 
              },
            ]}
          />
        </div>

        {/* Additional Info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              How Credits Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50">
                <div className="text-[#c3b383] text-3xl font-bold mb-2">40</div>
                <div className="text-white font-semibold mb-2">Credits per Generation</div>
                <div className="text-gray-400 text-sm">Each AI 3D model generation costs 40 credits</div>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50">
                <div className="text-[#c3b383] text-3xl font-bold mb-2">100</div>
                <div className="text-white font-semibold mb-2">Credits for $4</div>
                <div className="text-gray-400 text-sm">Get 100 credits for just $4 - that's 2.5 generations!</div>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50">
                <div className="text-[#c3b383] text-3xl font-bold mb-2">∞</div>
                <div className="text-white font-semibold mb-2">No Expiration</div>
                <div className="text-gray-400 text-sm">Credits never expire - use them whenever you want</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50">
              <h3 className="text-white font-semibold mb-2">What's the difference between Free and Pro?</h3>
              <p className="text-gray-300 text-sm">Free users get 1 generation per month and basic features. Pro users get unlimited generations, scene downloads, and advanced features.</p>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50">
              <h3 className="text-white font-semibold mb-2">Do credits expire?</h3>
              <p className="text-gray-300 text-sm">No! Credits never expire. Buy once and use them whenever you need them.</p>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50">
              <h3 className="text-white font-semibold mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-gray-300 text-sm">You can purchase more credits anytime. Free users automatically become Pro users with their first credit purchase.</p>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50">
              <h3 className="text-white font-semibold mb-2">What if I'm not satisfied?</h3>
              <p className="text-gray-300 text-sm">We offer a 30-day money-back guarantee. If you're not happy with your purchase, we'll refund your credits.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}