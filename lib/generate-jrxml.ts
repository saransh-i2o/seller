import type {
  SellerReport,
  CommunicationNotice,
} from "./report-data"

// ─── XML helpers ────────────────────────────────────────────────────────────

function esc(text: string | number): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * A compact builder for a <staticText> element.
 * `opts.bold`, `opts.italic`, `opts.size`, `opts.color`, `opts.hAlign`,
 * `opts.vAlign`, `opts.bgColor`, `opts.fontName`, `opts.mode`
 */
interface TextOpts {
  bold?: boolean
  italic?: boolean
  size?: number
  color?: string
  hAlign?: "Left" | "Center" | "Right"
  vAlign?: "Top" | "Middle" | "Bottom"
  bgColor?: string
  fontName?: string
  mode?: "Opaque" | "Transparent"
}

function staticText(
  x: number,
  y: number,
  w: number,
  h: number,
  text: string | number,
  opts: TextOpts = {},
): string {
  const {
    bold = false,
    italic = false,
    size = 10,
    color = "#000000",
    hAlign = "Left",
    vAlign = "Middle",
    bgColor,
    fontName = "SansSerif",
    mode,
  } = opts

  const modeAttr = mode ? ` mode="${mode}"` : bgColor ? ' mode="Opaque"' : ""
  const bgAttr = bgColor ? ` backcolor="${bgColor}"` : ""
  const fgAttr = ` forecolor="${color}"`

  return `<staticText>
  <reportElement x="${x}" y="${y}" width="${w}" height="${h}"${modeAttr}${bgAttr}${fgAttr}/>
  <textElement textAlignment="${hAlign}" verticalAlignment="${vAlign}">
    <font fontName="${fontName}" size="${size}" isBold="${bold}" isItalic="${italic}"/>
  </textElement>
  <text><![CDATA[${esc(text)}]]></text>
</staticText>`
}

function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  radius = 0,
): string {
  return `<rectangle radius="${radius}">
  <reportElement x="${x}" y="${y}" width="${w}" height="${h}" mode="Opaque" backcolor="${color}" forecolor="${color}"/>
</rectangle>`
}

function line(
  x1: number,
  y1: number,
  w: number,
  h: number,
  color = "#D1D8E0",
): string {
  return `<line>
  <reportElement x="${x1}" y="${y1}" width="${w}" height="${h}" forecolor="${color}"/>
</line>`
}

// ─── Section helpers ────────────────────────────────────────────────────────

function sectionHeader(y: number, title: string): { xml: string; nextY: number } {
  const h = 28
  const xml = [
    rect(0, y, 555, h, "#0F2B46", 4),
    staticText(12, y, 531, h, title, {
      bold: true,
      size: 12,
      color: "#FFFFFF",
      fontName: "Serif",
    }),
  ].join("\n")
  return { xml, nextY: y + h + 6 }
}

function pageTitle(y: number, title: string, subtitle?: string): { xml: string; nextY: number } {
  const lines: string[] = []
  lines.push(
    staticText(0, y, 555, 22, title, {
      bold: true,
      size: 16,
      color: "#0F2B46",
      fontName: "Serif",
    }),
  )
  let nextY = y + 24
  if (subtitle) {
    lines.push(
      staticText(0, nextY, 555, 16, subtitle, {
        size: 9,
        color: "#5C6B7A",
      }),
    )
    nextY += 20
  }
  lines.push(line(0, nextY, 555, 1, "#D1D8E0"))
  nextY += 6
  return { xml: lines.join("\n"), nextY }
}

// ─── Table builder ──────────────────────────────────────────────────────────

interface ColDef {
  label: string
  width: number
  align?: "Left" | "Center" | "Right"
}

function buildTable(
  x: number,
  y: number,
  totalWidth: number,
  cols: ColDef[],
  rows: string[][],
): { xml: string; nextY: number } {
  const lines: string[] = []
  const rowH = 18
  const headerH = 20

  // header bg
  lines.push(rect(x, y, totalWidth, headerH, "#F0F4F8"))

  // header labels
  let cx = x + 4
  for (const col of cols) {
    lines.push(
      staticText(cx, y, col.width - 4, headerH, col.label, {
        bold: true,
        size: 7,
        color: "#5C6B7A",
        hAlign: col.align ?? "Left",
      }),
    )
    cx += col.width
  }
  y += headerH

  // data rows
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]
    const bg = r % 2 === 1 ? "#F7F8FA" : "#FFFFFF"
    lines.push(rect(x, y, totalWidth, rowH, bg))
    lines.push(line(x, y, totalWidth, 1, "#E8ECF0"))

    cx = x + 4
    for (let c = 0; c < cols.length; c++) {
      lines.push(
        staticText(cx, y, cols[c].width - 4, rowH, row[c] ?? "", {
          size: 8,
          color: "#1B2A3D",
          hAlign: cols[c].align ?? "Left",
        }),
      )
      cx += cols[c].width
    }
    y += rowH
  }

  lines.push(line(x, y, totalWidth, 1, "#D1D8E0"))
  return { xml: lines.join("\n"), nextY: y + 4 }
}

// ─── Summary / metric card ─────────────────────────────────────────────────

function metricCard(
  x: number,
  y: number,
  w: number,
  h: number,
  value: string,
  label: string,
  color: string,
): string {
  return [
    rect(x, y, w, h, "#FFFFFF"),
    // border as 4 lines
    line(x, y, w, 1, "#D1D8E0"),
    line(x, y + h, w, 1, "#D1D8E0"),
    line(x, y, 1, h, "#D1D8E0"),
    line(x + w, y, 1, h, "#D1D8E0"),
    staticText(x, y + 4, w, 20, value, {
      bold: true,
      size: 16,
      color,
      hAlign: "Center",
      fontName: "Serif",
    }),
    staticText(x, y + 26, w, 14, label, {
      bold: true,
      size: 6,
      color: "#5C6B7A",
      hAlign: "Center",
    }),
  ].join("\n")
}

// ─── Line chart via JRXML chart elements ────────────────────────────────────

function buildLineChart(
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  datasetName: string,
  seriesLabel: string,
  lineColor: string,
): string {
  return `<lineChart>
  <chart isShowLegend="false">
    <reportElement x="${x}" y="${y}" width="${w}" height="${h}"/>
    <chartTitle>
      <font size="9" isBold="true"/>
      <titleExpression><![CDATA["${esc(title)}"]]></titleExpression>
    </chartTitle>
  </chart>
  <categoryDataset>
    <dataset>
      <datasetRun subDataset="${datasetName}">
        <dataSourceExpression><![CDATA[$P{${datasetName}_DS}]]></dataSourceExpression>
      </datasetRun>
    </dataset>
    <categorySeries>
      <seriesExpression><![CDATA["${esc(seriesLabel)}"]]></seriesExpression>
      <categoryExpression><![CDATA[$F{week}]]></categoryExpression>
      <valueExpression><![CDATA[$F{value}]]></valueExpression>
    </categorySeries>
  </categoryDataset>
  <linePlot>
    <plot/>
    <categoryAxisFormat>
      <axisFormat labelColor="#5C6B7A" tickLabelColor="#5C6B7A">
        <labelFont><font size="7"/></labelFont>
        <tickLabelFont><font size="7"/></tickLabelFont>
      </axisFormat>
    </categoryAxisFormat>
    <valueAxisFormat>
      <axisFormat labelColor="#5C6B7A" tickLabelColor="#5C6B7A">
        <labelFont><font size="7"/></labelFont>
        <tickLabelFont><font size="7"/></tickLabelFont>
      </axisFormat>
    </valueAxisFormat>
  </linePlot>
</lineChart>`
}

// ─── Section builders ───────────────────────────────────────────────────────

function buildProfileSection(data: SellerReport): { xml: string; height: number } {
  const { profile, marketplacePresence, catalogProfile } = data
  const parts: string[] = []
  let y = 0

  // Page title
  const pt = pageTitle(y, "Seller Details", "Comprehensive seller profile and marketplace presence")
  parts.push(pt.xml)
  y = pt.nextY

  // Profile section header
  const sh = sectionHeader(y, "Profile")
  parts.push(sh.xml)
  y = sh.nextY

  // Two-column key-value layout
  const fields: [string, string][] = [
    ["Reseller Name", profile.resellerName],
    ["Business Name", profile.businessName],
    ["Business Address", profile.businessAddress],
    ["Business E-mail", profile.businessEmail],
    ["Business Contact #", profile.businessContact],
    ["Business Point of Contact", profile.businessPointOfContact],
    ["Business Website", profile.businessWebsite],
    ["Business Established Date", profile.businessEstablishedDate],
    [
      "Supporting Links",
      profile.supportingLinks.map((l) => `${l.label}: ${l.url}`).join("; "),
    ],
    ["Location", `Lat: ${profile.location.lat}, Long: ${profile.location.lng}`],
    ["Marketplace Rating", `${profile.marketplaceRating} / 5`],
  ]

  // Background for profile card
  const cardH = Math.ceil(fields.length / 2) * 22 + 8
  parts.push(rect(0, y, 555, cardH, "#FFFFFF"))
  parts.push(line(0, y, 555, 1, "#D1D8E0"))
  parts.push(line(0, y + cardH, 555, 1, "#D1D8E0"))
  parts.push(line(0, y, 1, cardH, "#D1D8E0"))
  parts.push(line(555, y, 1, cardH, "#D1D8E0"))

  let fy = y + 4
  for (let i = 0; i < fields.length; i++) {
    const col = i % 2 === 0 ? 8 : 280
    parts.push(
      staticText(col, fy, 130, 10, fields[i][0], {
        bold: true,
        size: 7,
        color: "#5C6B7A",
      }),
    )
    parts.push(
      staticText(col, fy + 10, 260, 10, fields[i][1], {
        size: 8,
        color: "#1B2A3D",
      }),
    )
    if (i % 2 === 1 || i === fields.length - 1) {
      fy += 22
    }
  }
  y += cardH + 10

  // Marketplace Presence table
  const sh2 = sectionHeader(y, "Presence on Marketplaces")
  parts.push(sh2.xml)
  y = sh2.nextY

  const mpCols: ColDef[] = [
    { label: "MARKETPLACE", width: 95 },
    { label: "SELLER NAME", width: 120 },
    { label: "FIRST SEEN", width: 80 },
    { label: "LAST SEEN", width: 80 },
    { label: "ACTIVE LISTINGS", width: 80, align: "Right" },
    { label: "ALIASES", width: 100 },
  ]
  const mpRows = marketplacePresence.map((mp) => [
    mp.marketplace,
    mp.sellerName,
    mp.firstSeen,
    mp.lastSeen,
    String(mp.activeListings),
    mp.aliases.length > 0 ? mp.aliases.join(", ") : "--",
  ])
  const mpTable = buildTable(0, y, 555, mpCols, mpRows)
  parts.push(mpTable.xml)
  y = mpTable.nextY + 6

  // Assortment Breakdown by Category
  const sh3 = sectionHeader(y, "Assortment Breakdown by Category")
  parts.push(sh3.xml)
  y = sh3.nextY

  // Category tags
  let cx = 4
  for (const cat of catalogProfile.categories) {
    const tagW = cat.length * 6 + 16
    parts.push(rect(cx, y, tagW, 18, "#0F2B46", 3))
    parts.push(
      staticText(cx, y, tagW, 18, cat, {
        bold: true,
        size: 7,
        color: "#FFFFFF",
        hAlign: "Center",
      }),
    )
    cx += tagW + 6
  }
  y += 24

  // Category SKU grid
  const distribution: Record<string, number> = {
    Controllers: 6,
    Headsets: 5,
    "Charging Docks": 4,
    "Cables & Adapters": 4,
  }

  const colW = 270
  for (let i = 0; i < catalogProfile.categories.length; i++) {
    const cat = catalogProfile.categories[i]
    const xOff = i % 2 === 0 ? 0 : 280
    const skuCount =
      distribution[cat] ??
      Math.round(
        catalogProfile.brandSkusCarried / catalogProfile.categories.length,
      )
    parts.push(rect(xOff, y, colW, 22, "#F7F8FA"))
    parts.push(line(xOff, y, colW, 1, "#D1D8E0"))
    parts.push(line(xOff, y + 22, colW, 1, "#D1D8E0"))
    parts.push(
      staticText(xOff + 8, y, 180, 22, cat, {
        size: 8,
        color: "#1B2A3D",
        bold: true,
      }),
    )
    parts.push(
      staticText(xOff + 190, y, 70, 22, `${skuCount} SKUs`, {
        size: 8,
        color: "#0F2B46",
        bold: true,
        hAlign: "Right",
      }),
    )
    if (i % 2 === 1) y += 26
  }
  if (catalogProfile.categories.length % 2 !== 0) y += 26

  // Total
  parts.push(line(0, y, 555, 1, "#D1D8E0"))
  y += 4
  parts.push(
    staticText(8, y, 300, 16, "Total Brand SKUs Captured", {
      size: 9,
      color: "#5C6B7A",
      bold: true,
    }),
  )
  parts.push(
    staticText(400, y, 150, 16, String(catalogProfile.brandSkusCarried), {
      size: 13,
      color: "#0F2B46",
      bold: true,
      hAlign: "Right",
      fontName: "Serif",
    }),
  )
  y += 22

  return { xml: parts.join("\n"), height: y }
}

function groupByMarketplace(
  communications: CommunicationNotice[],
): Record<string, CommunicationNotice[]> {
  const groups: Record<string, CommunicationNotice[]> = {}
  for (const c of communications) {
    if (!groups[c.marketplace]) groups[c.marketplace] = []
    groups[c.marketplace].push(c)
  }
  return groups
}

function buildEnforcementSection(data: SellerReport): {
  xml: string
  height: number
} {
  const { communications, invoices, testBuyOrders } = data
  const parts: string[] = []
  let y = 0

  const pt = pageTitle(
    y,
    "Enforcement History",
    "Communications, notices, and test purchase records",
  )
  parts.push(pt.xml)
  y = pt.nextY

  // Communications grouped by marketplace
  const sh = sectionHeader(y, "Communications & Notices")
  parts.push(sh.xml)
  y = sh.nextY

  const grouped = groupByMarketplace(communications)
  for (const [marketplace, notices] of Object.entries(grouped)) {
    // marketplace label
    parts.push(
      staticText(4, y, 200, 18, marketplace, {
        bold: true,
        size: 9,
        color: "#0F2B46",
      }),
    )
    y += 20
    parts.push(line(0, y, 555, 1, "#D1D8E0"))
    y += 4

    const commCols: ColDef[] = [
      { label: "NOTICE", width: 140 },
      { label: "MESSAGE TYPE", width: 140 },
      { label: "SENT ON", width: 120 },
      { label: "STATUS", width: 155 },
    ]
    const commRows = notices.map((c) => [
      c.notice,
      c.messageType,
      c.sentOn,
      c.status,
    ])
    const t = buildTable(0, y, 555, commCols, commRows)
    parts.push(t.xml)
    y = t.nextY + 8
  }

  // Invoices
  if (invoices.length > 0) {
    const sh2 = sectionHeader(y, "Invoices Received")
    parts.push(sh2.xml)
    y = sh2.nextY

    parts.push(
      staticText(4, y, 540, 14, "Invoices received as part of Proof of Purchase or Policy Violation responses.", {
        size: 7,
        color: "#5C6B7A",
        italic: true,
      }),
    )
    y += 16

    const invCols: ColDef[] = [
      { label: "MARKETPLACE", width: 100 },
      { label: "INVOICE ID", width: 110 },
      { label: "DATE", width: 100 },
      { label: "TYPE", width: 245 },
    ]
    const invRows = invoices.map((inv) => [
      inv.marketplace,
      inv.id,
      inv.date,
      inv.type,
    ])
    const invT = buildTable(0, y, 555, invCols, invRows)
    parts.push(invT.xml)
    y = invT.nextY + 6
  }

  // Test Buy Orders
  const sh3 = sectionHeader(y, "Test Buy Orders")
  parts.push(sh3.xml)
  y = sh3.nextY

  const tbCols: ColDef[] = [
    { label: "ORDER ID", width: 70 },
    { label: "MARKETPLACE", width: 95 },
    { label: "PRODUCT CODE", width: 135 },
    { label: "ORDERED ON", width: 90 },
    { label: "RECEIVED ON", width: 90 },
    { label: "PACKAGE", width: 75 },
  ]
  const tbRows = testBuyOrders.map((o) => [
    o.orderId,
    o.marketplace,
    o.productCode,
    o.orderedOn,
    o.receivedOn,
    "Download",
  ])
  const tbT = buildTable(0, y, 555, tbCols, tbRows)
  parts.push(tbT.xml)
  y = tbT.nextY + 4

  parts.push(
    staticText(4, y, 540, 14, "Click the download link to retrieve the complete test purchase package.", {
      size: 7,
      color: "#5C6B7A",
      italic: true,
    }),
  )
  y += 18

  return { xml: parts.join("\n"), height: y }
}

function buildViolationsSection(data: SellerReport): {
  xml: string
  height: number
} {
  const { brandViolations } = data
  const parts: string[] = []
  let y = 0

  const pt = pageTitle(
    y,
    "Brand Violations",
    "Detected violations and marketplace ticket status",
  )
  parts.push(pt.xml)
  y = pt.nextY

  // Summary cards
  const total = brandViolations.length
  const underReview = brandViolations.filter(
    (v) => v.ticketStatus === "Under Review",
  ).length
  const filed = brandViolations.filter(
    (v) => v.ticketStatus === "Filed",
  ).length
  const resolved = brandViolations.filter(
    (v) => v.ticketStatus === "Resolved",
  ).length

  const cardW = 130
  const gap = 11
  parts.push(metricCard(0, y, cardW, 48, String(total), "TOTAL VIOLATIONS", "#0F2B46"))
  parts.push(metricCard(cardW + gap, y, cardW, 48, String(underReview), "UNDER REVIEW", "#B07D10"))
  parts.push(metricCard((cardW + gap) * 2, y, cardW, 48, String(filed), "FILED", "#1A5276"))
  parts.push(metricCard((cardW + gap) * 3, y, cardW, 48, String(resolved), "RESOLVED", "#1B7A4A"))
  y += 56

  // Violations table
  const sh = sectionHeader(y, "Brand Violations")
  parts.push(sh.xml)
  y = sh.nextY

  const vCols: ColDef[] = [
    { label: "VIOLATION TYPE", width: 160 },
    { label: "DATE OBSERVED", width: 100 },
    { label: "MARKETPLACE / URL", width: 175 },
    { label: "TICKET STATUS", width: 120 },
  ]
  const vRows = brandViolations.map((v) => [
    v.violationType,
    v.dateObserved,
    `${v.marketplace} - ${v.marketplaceUrl}`,
    v.ticketStatus,
  ])
  const vT = buildTable(0, y, 555, vCols, vRows)
  parts.push(vT.xml)
  y = vT.nextY

  return { xml: parts.join("\n"), height: y }
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`
}

function buildAnalyticsSection(data: SellerReport): {
  xml: string
  height: number
  subdatasets: string
} {
  const {
    weeklyTrends,
    lostSales,
    inventory,
    mapViolationsByProduct,
    activeProducts,
    analyticsMarketplace,
  } = data
  const parts: string[] = []
  let y = 0

  const pt = pageTitle(y, "Seller Analytics")
  parts.push(pt.xml)
  y = pt.nextY

  // Marketplace badge
  parts.push(
    staticText(0, y, 555, 16, `Marketplace: ${analyticsMarketplace}`, {
      bold: true,
      size: 9,
      color: "#0F2B46",
    }),
  )
  y += 22

  // Metric cards
  const totalLostSales = lostSales.reduce((s, i) => s + i.lostSales, 0)
  const totalLostUnits = lostSales.reduce((s, i) => s + i.lostUnits, 0)
  const totalInventory = inventory.reduce((s, i) => s + i.resellerInventory, 0)
  const totalMapViolations = weeklyTrends.reduce(
    (s, i) => s + i.mapViolations,
    0,
  )

  const cardW = 130
  const gap = 11
  parts.push(
    metricCard(
      0,
      y,
      cardW,
      48,
      formatCurrency(totalLostSales),
      "TOTAL LOST SALES",
      "#9B1C1C",
    ),
  )
  parts.push(
    metricCard(
      cardW + gap,
      y,
      cardW,
      48,
      `${totalInventory} units`,
      "RESELLER INVENTORY",
      "#1A5276",
    ),
  )
  parts.push(
    metricCard(
      (cardW + gap) * 2,
      y,
      cardW,
      48,
      String(totalMapViolations),
      "MAP VIOLATIONS",
      "#5B3A8C",
    ),
  )
  parts.push(
    metricCard(
      (cardW + gap) * 3,
      y,
      cardW,
      48,
      String(activeProducts.length),
      "ACTIVE PRODUCTS",
      "#1E8449",
    ),
  )
  y += 58

  // --- Charts ---
  // Lost Sales Trend (full width)
  parts.push(
    buildLineChart(
      0,
      y,
      555,
      200,
      "Lost Sales Trend (12 Weeks)",
      "LostSalesTrendDS",
      "Lost Sales",
      "#9B1C1C",
    ),
  )
  y += 210

  // Inventory + MAP side by side
  parts.push(
    buildLineChart(
      0,
      y,
      270,
      170,
      "Reseller Inventory Trend",
      "InventoryTrendDS",
      "Inventory",
      "#1A5276",
    ),
  )
  parts.push(
    buildLineChart(
      285,
      y,
      270,
      170,
      "MAP Violated Products Trend",
      "MapViolationsTrendDS",
      "MAP Violations",
      "#5B3A8C",
    ),
  )
  y += 180

  // Lost Sales product breakdown
  const sh1 = sectionHeader(y, "Lost Sales - Product Breakdown")
  parts.push(sh1.xml)
  y = sh1.nextY

  const lsCols: ColDef[] = [
    { label: "PRODUCT", width: 255 },
    { label: "LOST SALES", width: 150, align: "Right" },
    { label: "LOST UNITS", width: 150, align: "Right" },
  ]
  const lsRows = lostSales.map((i) => [
    i.product,
    formatCurrency(i.lostSales),
    String(i.lostUnits),
  ])
  // Total row
  lsRows.push(["Total", formatCurrency(totalLostSales), String(totalLostUnits)])
  const lsT = buildTable(0, y, 555, lsCols, lsRows)
  parts.push(lsT.xml)
  y = lsT.nextY + 6

  // Inventory product breakdown
  const sh2 = sectionHeader(y, "Inventory - Product Breakdown")
  parts.push(sh2.xml)
  y = sh2.nextY

  const invCols: ColDef[] = [
    { label: "PRODUCT", width: 355 },
    { label: "RESELLER INVENTORY", width: 200, align: "Right" },
  ]
  const invRows = inventory.map((i) => [i.product, String(i.resellerInventory)])
  invRows.push(["Total", String(totalInventory)])
  const invT = buildTable(0, y, 555, invCols, invRows)
  parts.push(invT.xml)
  y = invT.nextY + 6

  // MAP Violations product breakdown
  const sh3 = sectionHeader(y, "MAP Violations - Product Breakdown")
  parts.push(sh3.xml)
  y = sh3.nextY

  const mapCols: ColDef[] = [
    { label: "PRODUCT", width: 355 },
    { label: "WEEKS MAP VIOLATED", width: 200, align: "Right" },
  ]
  const mapRows = [...mapViolationsByProduct]
    .sort((a, b) => b.weeksViolated - a.weeksViolated)
    .map((i) => [i.product, String(i.weeksViolated)])
  const mapT = buildTable(0, y, 555, mapCols, mapRows)
  parts.push(mapT.xml)
  y = mapT.nextY + 6

  // Active Products
  const sh4 = sectionHeader(y, "Active Products")
  parts.push(sh4.xml)
  y = sh4.nextY

  const apCols: ColDef[] = [
    { label: "PRODUCT CODE", width: 355 },
    { label: "LAST SEEN", width: 200, align: "Right" },
  ]
  const apRows = [...activeProducts]
    .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
    .map((i) => [i.productCode, i.lastSeen])
  const apT = buildTable(0, y, 555, apCols, apRows)
  parts.push(apT.xml)
  y = apT.nextY

  // Build subdatasets for the 3 charts
  const subdatasets = buildChartSubdatasets(weeklyTrends)

  return { xml: parts.join("\n"), height: y, subdatasets }
}

function buildChartSubdatasets(
  weeklyTrends: SellerReport["weeklyTrends"],
): string {
  function ds(name: string, valueField: "lostSales" | "inventory" | "mapViolations"): string {
    return `<subDataset name="${name}">
  <field name="week" class="java.lang.String"/>
  <field name="value" class="java.lang.Number"/>
</subDataset>`
  }

  return [
    ds("LostSalesTrendDS", "lostSales"),
    ds("InventoryTrendDS", "inventory"),
    ds("MapViolationsTrendDS", "mapViolations"),
  ].join("\n")
}

// ─── Parameters for chart data sources ──────────────────────────────────────

function buildChartParameters(): string {
  return [
    `<parameter name="LostSalesTrendDS_DS" class="net.sf.jasperreports.engine.JRDataSource"/>`,
    `<parameter name="InventoryTrendDS_DS" class="net.sf.jasperreports.engine.JRDataSource"/>`,
    `<parameter name="MapViolationsTrendDS_DS" class="net.sf.jasperreports.engine.JRDataSource"/>`,
  ].join("\n")
}

// ─── Comment with chart data for reference ──────────────────────────────────

function buildChartDataComment(data: SellerReport): string {
  const lines = [
    "<!--",
    "  CHART DATA REFERENCE (for populating JRDataSource parameters when compiling):",
    "",
    "  LostSalesTrendDS_DS rows (week, value):",
  ]
  for (const t of data.weeklyTrends) {
    lines.push(`    "${t.week}", ${t.lostSales}`)
  }
  lines.push("")
  lines.push("  InventoryTrendDS_DS rows (week, value):")
  for (const t of data.weeklyTrends) {
    lines.push(`    "${t.week}", ${t.inventory}`)
  }
  lines.push("")
  lines.push("  MapViolationsTrendDS_DS rows (week, value):")
  for (const t of data.weeklyTrends) {
    lines.push(`    "${t.week}", ${t.mapViolations}`)
  }
  lines.push("-->")
  return lines.join("\n")
}

// ─── Main generator ─────────────────────────────────────────────────────────

export function generateJrxml(data: SellerReport): string {
  // Build all four sections
  const profileSection = buildProfileSection(data)
  const enforcementSection = buildEnforcementSection(data)
  const violationsSection = buildViolationsSection(data)
  const analyticsSection = buildAnalyticsSection(data)

  // Banner height
  const bannerH = 60
  // Confidential bar
  const confH = 20
  // Page footer
  const footerH = 25

  return `<?xml version="1.0" encoding="UTF-8"?>
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports
    http://jasperreports.sourceforge.net/xsd/jasperreport.xsd"
  name="Seller_Investigation_Report_${esc(data.profile.resellerName)}"
  pageWidth="595" pageHeight="842"
  columnWidth="555" leftMargin="20" rightMargin="20"
  topMargin="20" bottomMargin="20"
  uuid="seller-report-${Date.now()}">

${buildChartDataComment(data)}

${analyticsSection.subdatasets}

${buildChartParameters()}

<!-- ═══════════ TITLE BAND (Banner) ═══════════ -->
<title>
  <band height="${bannerH}">
    ${rect(0, 0, 555, bannerH, "#0F2B46", 0)}
    ${staticText(16, 6, 60, 24, "i2o", { bold: true, size: 18, color: "#FFFFFF", fontName: "Serif" })}
    ${staticText(16, 30, 300, 14, "Seller Investigation Report", { bold: true, size: 11, color: "#C8D6E5", fontName: "Serif" })}
    ${staticText(16, 44, 300, 12, `${esc(data.profile.resellerName)} - ${esc(data.profile.businessName)}`, { size: 8, color: "#8FA4B8" })}
    ${staticText(370, 6, 180, 14, `Report Generated: ${esc(data.reportGeneratedDate)}`, { size: 8, color: "#8FA4B8", hAlign: "Right" })}
    ${staticText(370, 20, 180, 14, `Seller ID: ${esc(data.profile.marketplaceSellerId)}`, { size: 8, color: "#8FA4B8", hAlign: "Right" })}
    ${staticText(370, 44, 180, 12, "CONFIDENTIAL", { bold: true, size: 7, color: "#E8B4B4", hAlign: "Right" })}
  </band>
</title>

<!-- ═══════════ PAGE HEADER (Confidential Bar) ═══════════ -->
<pageHeader>
  <band height="${confH}">
    ${rect(0, 0, 555, confH, "#F7F8FA")}
    ${line(0, confH - 1, 555, 1, "#D1D8E0")}
    ${staticText(0, 0, 555, confH, "CONFIDENTIAL - For Authorized Use Only", { bold: true, size: 7, color: "#9B1C1C", hAlign: "Center" })}
  </band>
</pageHeader>

<!-- ═══════════ DETAIL BAND 1: Seller Profile ═══════════ -->
<detail>
  <band height="${profileSection.height}" splitType="Stretch">
${profileSection.xml}
  </band>
</detail>

<!-- ═══════════ DETAIL BAND 2: Enforcement History ═══════════ -->
<detail>
  <band height="${enforcementSection.height}" splitType="Stretch">
${enforcementSection.xml}
  </band>
</detail>

<!-- ═══════════ DETAIL BAND 3: Brand Violations ═══════════ -->
<detail>
  <band height="${violationsSection.height}" splitType="Stretch">
${violationsSection.xml}
  </band>
</detail>

<!-- ═══════════ DETAIL BAND 4: Seller Analytics ═══════════ -->
<detail>
  <band height="${analyticsSection.height}" splitType="Stretch">
${analyticsSection.xml}
  </band>
</detail>

<!-- ═══════════ PAGE FOOTER ═══════════ -->
<pageFooter>
  <band height="${footerH}">
    ${line(0, 0, 555, 1, "#D1D8E0")}
    ${staticText(0, 4, 100, 16, "", { size: 7, color: "#5C6B7A" })}
    <textField>
      <reportElement x="0" y="4" width="100" height="16" forecolor="#5C6B7A"/>
      <textElement><font size="7"/></textElement>
      <textFieldExpression><![CDATA["Page " + $V{PAGE_NUMBER}]]></textFieldExpression>
    </textField>
    ${staticText(120, 4, 280, 16, `Seller Investigation Report - ${esc(data.profile.resellerName)}`, { size: 7, color: "#5C6B7A", hAlign: "Center" })}
    ${staticText(420, 4, 135, 16, `Generated ${esc(data.reportGeneratedDate)}`, { size: 7, color: "#5C6B7A", hAlign: "Right" })}
    ${staticText(0, 14, 555, 10, "CONFIDENTIAL", { bold: true, size: 6, color: "#9B1C1C", hAlign: "Center" })}
  </band>
</pageFooter>

</jasperReport>`
}
