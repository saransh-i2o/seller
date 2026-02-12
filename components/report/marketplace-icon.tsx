import { Store } from "lucide-react"

interface MarketplaceIconProps {
  marketplace: string
  size?: number
}

export function MarketplaceIcon({ marketplace, size = 18 }: MarketplaceIconProps) {
  const name = marketplace.toLowerCase()

  if (name.includes("amazon")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.63 13.57c-1.77 1.3-4.33 2-6.53 2-3.1 0-5.88-1.14-7.99-3.04-.17-.15-.02-.36.18-.24 2.27 1.32 5.09 2.12 7.99 2.12 1.96 0 4.11-.41 6.09-1.24.3-.13.55.2.26.4z"
          fill="currentColor"
        />
        <path
          d="M15.35 12.73c-.23-.29-1.5-.14-2.07-.07-.17.02-.2-.13-.04-.24 1.01-.71 2.68-.51 2.87-.27.19.24-.05 1.92-.1 2.15-.16.23-.31.11-.24-.09.23-.58.75-1.88.58-1.48z"
          fill="currentColor"
        />
        <path
          d="M13.32 7.37V6.5c0-.13.1-.22.22-.22h3.88c.12 0 .22.09.22.21v.75c0 .12-.1.28-.29.54l-2.01 2.87c.75-.02 1.54.09 2.22.47.15.09.19.21.2.33v.92c0 .13-.14.27-.28.2-.7-.37-1.62-.41-2.39.01-.12.07-.27-.07-.27-.2v-.88c0-.14 0-.37.15-.58l2.33-3.34h-2.03c-.12 0-.22-.1-.22-.22z"
          fill="currentColor"
        />
        <path
          d="M5.2 12.23h-1.18c-.11-.01-.2-.1-.21-.21V6.51c0-.12.1-.22.23-.22h1.1c.11.01.2.1.21.21v.74h.02c.28-.73.82-1.07 1.54-1.07.73 0 1.19.34 1.52 1.07.28-.73.92-1.07 1.61-1.07.49 0 1.02.2 1.35.65.37.5.29 1.22.29 1.85v3.36c0 .12-.1.22-.23.22H10.3c-.12-.01-.21-.11-.21-.22V8.98c0-.25.02-.87-.03-1.1-.08-.38-.34-.49-.67-.49-.28 0-.57.19-.69.49-.12.3-.11.8-.11 1.1v3.05c0 .12-.1.22-.23.22H7.19c-.12-.01-.21-.11-.21-.22V8.98c0-.66.11-1.63-.7-1.63-.82 0-.79.95-.79 1.63v3.04c0 .12-.1.22-.23.22z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name.includes("walmart")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2v6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 15.5V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M5.37 5.37l4.6 3.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14.03 15.38l4.6 3.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18.63 5.37l-4.6 3.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M5.37 18.63l4.6-3.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (name.includes("ebay")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <text x="12" y="15.5" textAnchor="middle" fill="currentColor" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
          eBay
        </text>
      </svg>
    )
  }

  // Fallback for other marketplaces
  return <Store size={size} />
}
