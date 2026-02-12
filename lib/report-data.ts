export interface SellerProfile {
  resellerName: string
  marketplaceSellerId: string
  businessName: string
  businessAddress: string
  businessEmail: string
  businessContact: string
  businessPointOfContact: string
  businessWebsite: string
  businessEstablishedDate: string
  supportingLinks: { label: string; url: string }[]
  marketplaceRating: number
  location: { lat: number; lng: number }
}

export interface MarketplacePresence {
  marketplace: string
  sellerName: string
  storefrontUrl: string
  firstSeen: string
  lastSeen: string
  activeListings: number
  color: string
  aliases: string[]
}

export interface StorefrontChange {
  dateOfChange: string
  resellerName: string
  marketplace: string
  evidenceUrl: string
  isCurrent: boolean
}

export interface CatalogProfile {
  categories: string[]
  brandSkusCarried: number
  competitorSkusCarried: number
  competitorBrands: {
    brand: string
    skuCount: number
    firstSeen: string
    lastSeen: string
  }[]
}

export interface CommunicationNotice {
  marketplace: string
  marketplaceColor: string
  notice: string
  messageType: string
  sentOn: string
  status: string
  viewCorrespondenceUrl: string
}

export interface Invoice {
  marketplace: string
  marketplaceColor: string
  id: string
  date: string
  type: string
  url: string
}

export interface TestBuyOrder {
  orderId: string
  marketplace: string
  marketplaceColor: string
  productCode: string
  orderedOn: string
  receivedOn: string
  downloadPackageUrl: string
}

export interface BrandViolation {
  violationType: string
  violationColor: string
  dateObserved: string
  marketplaceUrl: string
  marketplace: string
  evidenceUrl: string
  details: string[]
  ticketStatus: string
  ticketStatusColor: string
}

export interface LostSalesEntry {
  product: string
  lostSales: number
  lostUnits: number
  period: string
}

export interface InventoryEntry {
  product: string
  resellerInventory: number
  period: string
}

export interface MapViolationByProduct {
  product: string
  weeksViolated: number
}

export interface ActiveProduct {
  productCode: string
  lastSeen: string
}

export interface WeeklyTrend {
  week: string
  lostSales: number
  inventory: number
  mapViolations: number
}

export interface SellerReport {
  profile: SellerProfile
  marketplacePresence: MarketplacePresence[]
  storefrontChanges: StorefrontChange[]
  catalogProfile: CatalogProfile
  communications: CommunicationNotice[]
  invoices: Invoice[]
  correspondenceUrl: string
  testBuyOrders: TestBuyOrder[]
  brandViolations: BrandViolation[]
  analyticsMarketplace: string
  analyticsMarketplaceColor: string
  lostSales: LostSalesEntry[]
  inventory: InventoryEntry[]
  mapViolationsByProduct: MapViolationByProduct[]
  activeProducts: ActiveProduct[]
  weeklyTrends: WeeklyTrend[]
  reportGeneratedDate: string
}

export const sampleReport: SellerReport = {
  reportGeneratedDate: "Sep 8, 2025",
  profile: {
    resellerName: "PantherProvisions",
    marketplaceSellerId: "AIPPVRE112345",
    businessName: "Panther Provisions LLC",
    businessAddress: "410 Market St, Austin, TX 78701",
    businessEmail: "ops@pantherprovisions.co",
    businessContact: "512-555-0198",
    businessPointOfContact: "Jordan Rivera",
    businessWebsite: "https://pantherprovisions.co",
    businessEstablishedDate: "Mar 15, 2022",
    supportingLinks: [
      { label: "LinkedIn Profile", url: "https://linkedin.com/company/pantherprovisions" },
      { label: "BBB Listing", url: "https://bbb.org/pantherprovisions" },
    ],
    marketplaceRating: 4.4,
    location: { lat: 30.265, lng: -97.742 },
  },
  marketplacePresence: [
    {
      marketplace: "Amazon US",
      sellerName: "PantherProvisions",
      storefrontUrl: "https://www.amazon.com/sp?seller=AIPPVRE112345",
      firstSeen: "Jan 12, 2023",
      lastSeen: "Sep 5, 2025",
      activeListings: 19,
      color: "#FF9900",
      aliases: ["Advanctech"],
    },
    {
      marketplace: "Walmart US",
      sellerName: "Panther Provisions LLC",
      storefrontUrl: "https://www.walmart.com/seller/pantherprovisions",
      firstSeen: "Jun 3, 2025",
      lastSeen: "Sep 5, 2025",
      activeListings: 11,
      color: "#0071DC",
      aliases: [],
    },
    {
      marketplace: "eBay",
      sellerName: "PantherProvisions Store",
      storefrontUrl: "https://www.ebay.com/str/pantherprovisions",
      firstSeen: "Jul 18, 2025",
      lastSeen: "Sep 4, 2025",
      activeListings: 7,
      color: "#E53238",
      aliases: [],
    },
  ],
  storefrontChanges: [
    {
      dateOfChange: "Current",
      resellerName: "PantherProvisions",
      marketplace: "Amazon",
      evidenceUrl: "#",
      isCurrent: true,
    },
    {
      dateOfChange: "Previous",
      resellerName: "Advanctech",
      marketplace: "Amazon",
      evidenceUrl: "#",
      isCurrent: false,
    },
  ],
  catalogProfile: {
    categories: ["Controllers", "Headsets", "Charging Docks", "Cables & Adapters"],
    brandSkusCarried: 19,
    competitorSkusCarried: 37,
    competitorBrands: [
      { brand: "Xbox", skuCount: 14, firstSeen: "Jul 20, 2025", lastSeen: "Sep 5, 2025" },
      { brand: "HyperX", skuCount: 9, firstSeen: "Jul 28, 2025", lastSeen: "Sep 6, 2025" },
      { brand: "Razer", skuCount: 8, firstSeen: "Aug 1, 2025", lastSeen: "Sep 4, 2025" },
      { brand: "SteelSeries", skuCount: 6, firstSeen: "Aug 10, 2025", lastSeen: "Sep 3, 2025" },
    ],
  },
  communications: [
    {
      marketplace: "Amazon US",
      marketplaceColor: "#FF9900",
      notice: "Proof of Purchase",
      messageType: "Verification Request",
      sentOn: "Aug 30, 2025",
      status: "Opened",
      viewCorrespondenceUrl: "#",
    },
    {
      marketplace: "Amazon US",
      marketplaceColor: "#FF9900",
      notice: "Proof of Purchase",
      messageType: "Second Reminder",
      sentOn: "Aug 22, 2025",
      status: "Opened",
      viewCorrespondenceUrl: "#",
    },
    {
      marketplace: "Amazon US",
      marketplaceColor: "#FF9900",
      notice: "Proof of Purchase",
      messageType: "Final Warning",
      sentOn: "Aug 15, 2025",
      status: "Delivered",
      viewCorrespondenceUrl: "#",
    },
    {
      marketplace: "Amazon US",
      marketplaceColor: "#FF9900",
      notice: "Policy Violation",
      messageType: "Cease & Desist",
      sentOn: "Sep 1, 2025",
      status: "Delivered",
      viewCorrespondenceUrl: "#",
    },
    {
      marketplace: "Walmart US",
      marketplaceColor: "#0071DC",
      notice: "Proof of Purchase",
      messageType: "Verification Request",
      sentOn: "Jul 10, 2025",
      status: "Delivered",
      viewCorrespondenceUrl: "#",
    },
  ],
  invoices: [
    { marketplace: "Amazon US", marketplaceColor: "#FF9900", id: "INV-2025-0891", date: "Aug 18, 2025", type: "Proof of Purchase Response", url: "#" },
    { marketplace: "Walmart US", marketplaceColor: "#0071DC", id: "INV-2025-0923", date: "Sep 2, 2025", type: "Policy Violation Response", url: "#" },
  ],
  correspondenceUrl: "#",
  analyticsMarketplace: "Amazon US",
  analyticsMarketplaceColor: "#FF9900",
  testBuyOrders: [
    {
      orderId: "TB-001",
      marketplace: "Amazon US",
      marketplaceColor: "#FF9900",
      productCode: "ASIN-B09DKG2154",
      orderedOn: "Aug 19, 2025",
      receivedOn: "Aug 22, 2025",
      downloadPackageUrl: "#",
    },
    {
      orderId: "TB-002",
      marketplace: "Walmart US",
      marketplaceColor: "#0071DC",
      productCode: "WM-IP-4839201",
      orderedOn: "Aug 21, 2025",
      receivedOn: "Aug 23, 2025",
      downloadPackageUrl: "#",
    },
  ],
  brandViolations: [
    {
      violationType: "Bundled competitor product",
      violationColor: "#8E44AD",
      dateObserved: "Sep 2, 2025",
      marketplace: "Amazon US",
      marketplaceUrl: "amazon.com/dp/ASIN1",
      evidenceUrl: "#",
      details: ["Bundled with competitor SKU.", "Incorrect brand imagery used."],
      ticketStatus: "Under Review",
      ticketStatusColor: "#E67E22",
    },
    {
      violationType: "Unauthorized logo use",
      violationColor: "#2980B9",
      dateObserved: "Aug 24, 2025",
      marketplace: "Walmart US",
      marketplaceUrl: "walmart.com/ip/ITEM2",
      evidenceUrl: "#",
      details: ["Used Sony PlayStation logo in unauthorized manner.", "Misrepresentation of brand affiliation."],
      ticketStatus: "Filed",
      ticketStatusColor: "#3498DB",
    },
    {
      violationType: "MAP breach",
      violationColor: "#E74C3C",
      dateObserved: "Aug 15, 2025",
      marketplace: "Amazon US",
      marketplaceUrl: "amazon.com/dp/ASIN2",
      evidenceUrl: "#",
      details: ["Price set 12% below Minimum Advertised Price (MAP)."],
      ticketStatus: "Resolved",
      ticketStatusColor: "#27AE60",
    },
  ],
  lostSales: [
    { product: "DualSense Wireless Controller", lostSales: 12450, lostUnits: 83, period: "Last 12 Weeks" },
    { product: "Pulse 3D Wireless Headset", lostSales: 8920, lostUnits: 56, period: "Last 12 Weeks" },
    { product: "DualSense Charging Station", lostSales: 4380, lostUnits: 146, period: "Last 12 Weeks" },
    { product: "HD Camera", lostSales: 3210, lostUnits: 41, period: "Last 12 Weeks" },
    { product: "Media Remote", lostSales: 1870, lostUnits: 62, period: "Last 12 Weeks" },
  ],
  inventory: [
    { product: "DualSense Wireless Controller", resellerInventory: 45, period: "Last 12 Weeks" },
    { product: "Pulse 3D Wireless Headset", resellerInventory: 28, period: "Last 12 Weeks" },
    { product: "DualSense Charging Station", resellerInventory: 67, period: "Last 12 Weeks" },
    { product: "HD Camera", resellerInventory: 19, period: "Last 12 Weeks" },
    { product: "Media Remote", resellerInventory: 34, period: "Last 12 Weeks" },
  ],
  mapViolationsByProduct: [
    { product: "DualSense Wireless Controller", weeksViolated: 9 },
    { product: "Pulse 3D Wireless Headset", weeksViolated: 7 },
    { product: "DualSense Charging Station", weeksViolated: 5 },
    { product: "HD Camera", weeksViolated: 3 },
    { product: "Media Remote", weeksViolated: 2 },
  ],
  activeProducts: [
    { productCode: "ASIN-B09DKG2154", lastSeen: "Dec 10, 2025" },
    { productCode: "ASIN-B09DFHWKWP", lastSeen: "Dec 9, 2025" },
    { productCode: "ASIN-B0BL1GKVT3", lastSeen: "Dec 8, 2025" },
    { productCode: "ASIN-B09DKG8HWL", lastSeen: "Dec 11, 2025" },
    { productCode: "ASIN-B09DKG6LXN", lastSeen: "Dec 7, 2025" },
    { productCode: "ASIN-B09DFCWDB7", lastSeen: "Dec 12, 2025" },
    { productCode: "ASIN-B0BTG4PSLW", lastSeen: "Dec 6, 2025" },
  ],
  weeklyTrends: [
    { week: "W1", lostSales: 2100, inventory: 120, mapViolations: 3 },
    { week: "W2", lostSales: 2450, inventory: 115, mapViolations: 2 },
    { week: "W3", lostSales: 1980, inventory: 130, mapViolations: 4 },
    { week: "W4", lostSales: 2800, inventory: 108, mapViolations: 5 },
    { week: "W5", lostSales: 3100, inventory: 95, mapViolations: 3 },
    { week: "W6", lostSales: 2650, inventory: 102, mapViolations: 2 },
    { week: "W7", lostSales: 2900, inventory: 98, mapViolations: 6 },
    { week: "W8", lostSales: 3400, inventory: 88, mapViolations: 4 },
    { week: "W9", lostSales: 2750, inventory: 105, mapViolations: 3 },
    { week: "W10", lostSales: 3200, inventory: 92, mapViolations: 5 },
    { week: "W11", lostSales: 2500, inventory: 110, mapViolations: 2 },
    { week: "W12", lostSales: 3000, inventory: 100, mapViolations: 4 },
  ],
}
