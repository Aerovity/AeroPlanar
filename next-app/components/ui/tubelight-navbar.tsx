"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import { ShoppingCart, Home, Star, Users, HelpCircle, DollarSign, Settings, LogIn, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  activeSection?: string
  showCart?: boolean
  cartCount?: number
  onCartClick?: () => void
}

export function NavBar({ items, className, activeSection, showCart = false, cartCount = 0, onCartClick }: NavBarProps) {
  const { user, profile, loading, signOut } = useAuth()
  
  // Default landing page navigation items
  const landingNavItems = [
    { name: "Home", url: "#hero", icon: Home },
    { name: "Testimonials", url: "#testimonials", icon: Users },
    { name: "About", url: "#about", icon: Star },
    { name: "FAQ", url: "#faq", icon: HelpCircle },
    { name: "Pricing", url: "/pricing", icon: DollarSign },
    { name: "Studio", url: "/studio", icon: Settings },
  ]

  // Use provided items or default to landing page items
  const navigationItems = items.length > 0 ? items : landingNavItems
  
  const [activeTab, setActiveTab] = useState(navigationItems[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Live scroll detection for section highlighting
      const sections = ['hero', 'testimonials', 'about', 'faq']
      const scrollPosition = window.scrollY + 200 // Offset for better detection
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = window.scrollY + rect.top
          const elementBottom = elementTop + element.offsetHeight
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            const sectionToNavMap: { [key: string]: string } = {
              hero: "Home",
              testimonials: "Testimonials",
              about: "About",
              faq: "FAQ",
            }
            const navName = sectionToNavMap[sectionId]
            if (navName && navName !== activeTab) {
              setActiveTab(navName)
            }
            break
          }
        }
      }
    }

    handleResize()
    handleScroll()
    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeTab])

  useEffect(() => {
    if (activeSection) {
      // Map section IDs to nav item names for landing page
      const sectionToNavMap: { [key: string]: string } = {
        hero: "Home",
        testimonials: "Testimonials",
        about: "About",
        faq: "FAQ",
        pricing: "Pricing",
        studio: "Studio",
      }

      const navName = sectionToNavMap[activeSection]
      if (navName) {
        setActiveTab(navName)
      }
    }
  }, [activeSection])

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out pointer-events-none",
        isScrolled
          ? "bottom-0 sm:top-4 mb-6 sm:mb-0" // Compact navbar when scrolled
          : "top-0 w-full max-w-none", // Full header when at top
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center backdrop-blur-lg shadow-lg transition-all duration-500 ease-in-out pointer-events-auto",
          isScrolled
            ? "gap-1 py-1 px-3 rounded-full bg-background/90 border border-border/80 scale-95 justify-center" // Compact style - centered
            : isMobile
            ? "gap-1 py-1 px-4 rounded-none bg-background/5 border-b border-border w-full justify-center" // Mobile full header style - centered, smaller padding
            : "gap-4 py-2 px-6 rounded-none bg-background/5 border-b border-border w-full justify-center", // Desktop full header style - centered, smaller padding
        )}
      >
        <div className={cn("flex items-center transition-all duration-500", isScrolled ? "hidden" : "flex mr-8")}>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="AeroPlanar Logo"
              width={isScrolled ? 40 : isMobile ? 80 : 120}
              height={isScrolled ? 40 : isMobile ? 80 : 120}
              className={cn(
                "object-contain hover:scale-105 transition-all duration-300",
                isScrolled ? "w-10 h-10" : isMobile ? "w-20 h-20" : "w-30 h-30",
              )}
              priority
            />
          </Link>
        </div>

        <div className={cn("flex items-center transition-all duration-500", isScrolled ? "gap-1" : isMobile ? "gap-1" : "gap-4")}>
          {navigationItems.slice(0, isMobile && !isScrolled ? 5 : navigationItems.length).map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold rounded-full transition-all duration-300",
                  "text-white hover:text-[#c3b383]",
                  isScrolled ? "px-3 py-1.5" : isMobile ? "px-2 py-1.5" : "px-4 py-2",
                  isActive && "text-[#c3b383]",
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={isMobile && !isScrolled ? 16 : 18} strokeWidth={2.5} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full rounded-full -z-10"
                    style={{ backgroundColor: "#c3b383" + "20" }}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 rounded-t-full transition-all duration-300",
                        isScrolled ? "-top-2 w-8 h-1" : isMobile ? "-top-2 w-6 h-1" : "-top-3 w-10 h-2",
                      )}
                      style={{ backgroundColor: "#c3b383" }}
                    >
                      <div
                        className={cn(
                          "absolute rounded-full blur-md -left-2 transition-all duration-300",
                          isScrolled ? "w-12 h-6 -top-2" : isMobile ? "w-10 h-4 -top-2" : "w-14 h-8 -top-3",
                        )}
                        style={{ backgroundColor: "#c3b383" + "33" }}
                      />
                      <div
                        className={cn(
                          "absolute rounded-full blur-md transition-all duration-300",
                          isScrolled ? "w-8 h-6 -top-1" : isMobile ? "w-6 h-4 -top-1" : "w-10 h-8 -top-2",
                        )}
                        style={{ backgroundColor: "#c3b383" + "33" }}
                      />
                      <div
                        className={cn(
                          "absolute rounded-full blur-sm transition-all duration-300",
                          isScrolled ? "w-4 h-4 top-0 left-2" : isMobile ? "w-3 h-3 top-0 left-1.5" : "w-6 h-6 top-0 left-2",
                        )}
                        style={{ backgroundColor: "#c3b383" + "33" }}
                      />
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
          
          {/* User Profile or Sign in */}
          <div className="flex items-center gap-3">
            <div className="w-px h-6 bg-white/30" />
            {loading ? (
              <div className={cn(
                "relative cursor-pointer text-sm font-semibold rounded-full transition-all duration-300",
                "text-white flex items-center gap-2",
                isScrolled ? "px-3 py-1.5" : isMobile ? "px-2 py-1.5" : "px-4 py-2",
              )}>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "relative cursor-pointer text-sm font-semibold rounded-full transition-all duration-300",
                    "text-white hover:text-[#c3b383] flex items-center gap-2",
                    isScrolled ? "px-3 py-1.5" : isMobile ? "px-2 py-1.5" : "px-4 py-2",
                  )}>
                    <Avatar className={cn(
                      "border-2 border-white/20 hover:border-[#c3b383]/50",
                      isScrolled || isMobile ? "h-6 w-6" : "h-8 w-8"
                    )}>
                      <AvatarImage 
                        src={profile?.avatar_url || undefined} 
                        alt={profile?.username || user.email || "User"} 
                      />
                      <AvatarFallback className="bg-[#c3b383]/20 text-white text-xs font-semibold">
                        {profile?.first_name?.[0] || profile?.username?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline max-w-20 truncate">
                      {profile?.first_name || profile?.username || user.email?.split('@')[0] || 'User'}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-background/95 backdrop-blur-sm border border-border/80"
                >
                  <div className="px-3 py-2 border-b border-border/50">
                    <p className="text-sm font-medium">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : profile?.username || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {profile?.is_admin && (
                      <p className="text-xs text-[#c3b383] font-medium">Admin</p>
                    )}
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/sign-in"
                className={cn(
                  "relative cursor-pointer text-sm font-semibold rounded-full transition-all duration-300",
                  "text-white hover:text-[#c3b383] flex items-center gap-2",
                  isScrolled ? "px-3 py-1.5" : isMobile ? "px-2 py-1.5" : "px-4 py-2",
                )}
              >
                <span className="hidden md:inline">Sign in</span>
                <span className="md:hidden">
                  <LogIn size={isMobile && !isScrolled ? 16 : 18} strokeWidth={2.5} />
                </span>
              </Link>
            )}
          </div>
          
          {/* Cart Icon - Only show when showCart is true */}
          {showCart && (
            <button
              onClick={onCartClick}
              className={cn(
                "relative cursor-pointer text-sm font-semibold rounded-full transition-all duration-300",
                "text-foreground/80 hover:text-primary bg-primary/20 hover:bg-primary/30",
                isScrolled ? "px-3 py-1.5" : isMobile ? "px-2 py-1.5" : "px-6 py-3",
                "flex items-center gap-2"
              )}
            >
              <ShoppingCart size={isMobile && !isScrolled ? 16 : 18} strokeWidth={2.5} />
              <span className={cn("font-medium", isScrolled ? "text-xs" : "text-sm")}>
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
