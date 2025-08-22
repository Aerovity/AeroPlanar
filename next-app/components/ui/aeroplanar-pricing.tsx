"use client"

import { motion } from "framer-motion"
import { Check, X, Sparkles, Download, Upload, Share, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { SpotlightButton } from "@/components/ui/spotlight-button"
import { Card } from "@/components/ui/card"

interface BenefitProps {
  text: string
  checked: boolean
  icon?: React.ReactNode
}

const Benefit = ({ text, checked, icon }: BenefitProps) => {
  return (
    <div className="flex items-center gap-3">
      {checked ? (
        <span className="grid size-5 place-content-center rounded-full bg-[#c3b383] text-sm text-black">
          <Check className="size-3 font-bold" />
        </span>
      ) : (
        <span className="grid size-5 place-content-center rounded-full bg-gray-800/50 text-sm text-gray-500">
          <X className="size-3" />
        </span>
      )}
      <div className="flex items-center gap-2">
        {icon && <span className="text-[#c3b383]">{icon}</span>}
        <span className="text-sm text-gray-200">{text}</span>
      </div>
    </div>
  )
}

interface PricingCardProps {
  tier: string
  price: string
  period?: string
  credits?: string
  bestFor: string
  CTA: string
  benefits: Array<{ text: string; checked: boolean; icon?: React.ReactNode }>
  className?: string
  featured?: boolean
  onClick?: () => void
}

export const AeroplanarPricingCard = ({
  tier,
  price,
  period,
  credits,
  bestFor,
  CTA,
  benefits,
  className,
  featured = false,
  onClick,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ filter: "blur(2px)", opacity: 0, y: 20 }}
      whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
      whileHover={{ y: -5 }}
      className={cn("h-full", featured && "pt-3")}
    >
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-[#c3b383] to-[#d4c496] text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg">
            RECOMMENDED
          </div>
        </div>
      )}
      <Card
        className={cn(
          "relative h-full w-full border transition-all duration-300",
          "bg-gradient-to-br from-[#000208]/90 to-[#0a0f1a]/90",
          "border-gray-800/50 backdrop-blur-sm",
          "hover:border-[#c3b383]/30 hover:shadow-lg hover:shadow-[#c3b383]/10",
          featured && "border-[#c3b383]/50 shadow-lg shadow-[#c3b383]/20 scale-105 mt-3",
          "p-6",
          className,
        )}
      >

        <div className="flex flex-col items-center border-b pb-6 border-gray-800/50">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-[#c3b383]" />
            <span className="text-xl font-bold text-white">{tier}</span>
          </div>
          
          <div className="text-center mb-3">
            <span className="text-4xl font-bold text-white">{price}</span>
            {period && <span className="text-gray-400 text-lg ml-1">{period}</span>}
          </div>
          
          {credits && (
            <div className="bg-[#c3b383]/20 text-[#c3b383] px-3 py-1 rounded-full text-sm font-semibold mb-3">
              {credits}
            </div>
          )}
          
          <span className="text-center text-gray-300 font-medium">
            {bestFor}
          </span>
        </div>

        <div className="space-y-4 py-8 flex-1">
          {benefits.map((benefit, index) => (
            <Benefit key={index} {...benefit} />
          ))}
        </div>

        <div className="pt-4">
          <SpotlightButton
            onClick={onClick}
            className={cn(
              "w-full bg-gradient-to-br from-black to-neutral-800 hover:from-neutral-900 hover:to-black text-[#c3b383] font-medium border border-[#c3b383]/30",
              featured && "bg-gradient-to-br from-[#c3b383] to-[#d4c496] text-white hover:from-[#d4c496] hover:to-[#c3b383] border-[#c3b383]"
            )}
          >
            {CTA}
          </SpotlightButton>
        </div>
      </Card>
    </motion.div>
  )
}