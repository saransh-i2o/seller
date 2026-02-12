"use client"

import { SectionCard } from "./section-card"
import { PageHeader } from "./page-header"
import { MarketplaceIcon } from "./marketplace-icon" // Import MarketplaceIcon
import type { SellerReport } from "@/lib/report-data"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface PageAnalyticsProps {
  data: SellerReport
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`
}

export function PageAnalytics({ data }: PageAnalyticsProps) {
  const { weeklyTrends, lostSales, inventory, mapViolationsByProduct, activeProducts, analyticsMarketplace, analyticsMarketplaceColor } = data

  const totalLostSales = lostSales.reduce((sum, item) => sum + item.lostSales, 0)
  const totalLostUnits = lostSales.reduce((sum, item) => sum + item.lostUnits, 0)
  const totalInventory = inventory.reduce((sum, item) => sum + item.resellerInventory, 0)
  const totalMapViolations = weeklyTrends.reduce((sum, item) => sum + item.mapViolations, 0)

  return (
    <div className="report-page">
      <PageHeader
        title="Seller Analytics"
        badge={
          <span
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-md shadow-sm"
            style={{ backgroundColor: analyticsMarketplaceColor }}
          >
            <MarketplaceIcon marketplace={analyticsMarketplace} />
            {analyticsMarketplace}
          </span>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <MetricCard label="Total Lost Sales (Last 12 Weeks)" value={formatCurrency(totalLostSales)} color="#9B1C1C" />
        <MetricCard label="Reseller Inventory" value={`${totalInventory.toLocaleString()} units`} color="#1A5276" />
        <MetricCard label="MAP Violations" value={String(totalMapViolations)} color="#5B3A8C" />
        <MetricCard label="Active Products" value={String(activeProducts.length)} color="#1E8449" />
      </div>

      <SectionCard title="Lost Sales Trend (12 Weeks)">
        <div style={{ width: "100%", minHeight: 256 }}>
          <ResponsiveContainer width="100%" height={256}>
            <LineChart data={weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#5C6B7A" }} />
              <YAxis tick={{ fontSize: 12, fill: "#5C6B7A" }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Lost Sales"]}
                contentStyle={{
                  borderRadius: "4px",
                  border: "1px solid #D1D8E0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  fontSize: "12px",
                  fontFamily: "var(--font-source-sans)",
                }}
              />
              <Line
                type="monotone"
                dataKey="lostSales"
                stroke="#9B1C1C"
                strokeWidth={2}
                dot={{ fill: "#9B1C1C", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-5">
        <SectionCard title="Reseller Inventory Trend">
          <div style={{ width: "100%", minHeight: 208 }}>
            <ResponsiveContainer width="100%" height={208}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#5C6B7A" }} />
                <YAxis tick={{ fontSize: 11, fill: "#5C6B7A" }} />
                <Tooltip
                  formatter={(value: number) => [value, "Inventory"]}
                  contentStyle={{
                    borderRadius: "4px",
                    border: "1px solid #D1D8E0",
                    fontSize: "12px",
                  }}
                />
                <Line type="monotone" dataKey="inventory" stroke="#1A5276" strokeWidth={2} dot={{ fill: "#1A5276", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="MAP Violated Products Trend">
          <div style={{ width: "100%", minHeight: 208 }}>
            <ResponsiveContainer width="100%" height={208}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#5C6B7A" }} />
                <YAxis tick={{ fontSize: 11, fill: "#5C6B7A" }} />
                <Tooltip
                  formatter={(value: number) => [value, "MAP Violations"]}
                  contentStyle={{
                    borderRadius: "4px",
                    border: "1px solid #D1D8E0",
                    fontSize: "12px",
                  }}
                />
                <Line type="monotone" dataKey="mapViolations" stroke="#5B3A8C" strokeWidth={2} dot={{ fill: "#5B3A8C", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Lost Sales - Product Breakdown (Nov 12, 2025 - Dec 12, 2025)">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-[#5C6B7A] uppercase tracking-wider">
              <th className="pb-3">Product</th>
              <th className="pb-3 text-right">Lost Sales</th>
              <th className="pb-3 text-right">Lost Units</th>
            </tr>
          </thead>
          <tbody>
            {lostSales.map((item) => (
              <tr key={item.product} className="border-t border-[#E8ECF0]">
                <td className="py-2.5 text-[#1B2A3D] font-medium">{item.product}</td>
                <td className="py-2.5 text-right text-[#9B1C1C] font-semibold">
                  {formatCurrency(item.lostSales)}
                </td>
                <td className="py-2.5 text-right text-[#B07D10] font-semibold">{item.lostUnits}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#0F2B46]">
              <td className="py-2.5 font-bold text-[#0F2B46]">Total</td>
              <td className="py-2.5 text-right font-bold text-[#9B1C1C]">{formatCurrency(totalLostSales)}</td>
              <td className="py-2.5 text-right font-bold text-[#B07D10]">{totalLostUnits}</td>
            </tr>
          </tfoot>
        </table>
      </SectionCard>

      <SectionCard title="Inventory - Product Breakdown (as of Dec 12, 2025)">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-[#5C6B7A] uppercase tracking-wider">
              <th className="pb-3">Product</th>
              <th className="pb-3 text-right">Reseller Inventory</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.product} className="border-t border-[#E8ECF0]">
                <td className="py-2.5 text-[#1B2A3D] font-medium">{item.product}</td>
                <td className="py-2.5 text-right text-[#1A5276] font-semibold">
                  {item.resellerInventory}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#0F2B46]">
              <td className="py-2.5 font-bold text-[#0F2B46]">Total</td>
              <td className="py-2.5 text-right font-bold text-[#1A5276]">{totalInventory}</td>
            </tr>
          </tfoot>
        </table>
      </SectionCard>

      <SectionCard title="MAP Violations - Product Breakdown (Nov 12, 2025 - Dec 12, 2025)">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-[#5C6B7A] uppercase tracking-wider">
              <th className="pb-3">Product</th>
              <th className="pb-3 text-right">Weeks MAP Violated</th>
            </tr>
          </thead>
          <tbody>
            {[...mapViolationsByProduct]
              .sort((a, b) => b.weeksViolated - a.weeksViolated)
              .map((item) => (
                <tr key={item.product} className="border-t border-[#E8ECF0]">
                  <td className="py-2.5 text-[#1B2A3D] font-medium">{item.product}</td>
                  <td className="py-2.5 text-right text-[#5B3A8C] font-semibold">{item.weeksViolated}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Active Products">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-[#5C6B7A] uppercase tracking-wider">
              <th className="pb-3">Product Code</th>
              <th className="pb-3 text-right">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {[...activeProducts]
              .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
              .map((item) => (
                <tr key={item.productCode} className="border-t border-[#E8ECF0]">
                  <td className="py-2.5 font-mono text-xs text-[#1B2A3D] font-medium">{item.productCode}</td>
                  <td className="py-2.5 text-right text-[#5C6B7A]">{item.lastSeen}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="border border-[#D1D8E0] rounded p-4 bg-white">
      <p className="text-xs text-[#5C6B7A] uppercase tracking-wide font-semibold">{label}</p>
      <p className="text-xl font-serif font-bold mt-1" style={{ color }}>{value}</p>
    </div>
  )
}
