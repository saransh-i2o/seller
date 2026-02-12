import { SectionCard } from "./section-card"
import { PageHeader } from "./page-header"

import type { SellerReport } from "@/lib/report-data"

interface PageViolationsProps {
  data: SellerReport
}

export function PageViolations({ data }: PageViolationsProps) {
  const { brandViolations } = data

  const violationSummary = {
    total: brandViolations.length,
    underReview: brandViolations.filter((v) => v.ticketStatus === "Under Review").length,
    filed: brandViolations.filter((v) => v.ticketStatus === "Filed").length,
    resolved: brandViolations.filter((v) => v.ticketStatus === "Resolved").length,
  }

  return (
    <div className="report-page">
      <PageHeader title="Brand Violations" subtitle="Detected violations and marketplace ticket status" />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <SummaryCard value={violationSummary.total} label="Total Violations" color="#0F2B46" />
        <SummaryCard value={violationSummary.underReview} label="Under Review" color="#B07D10" />
        <SummaryCard value={violationSummary.filed} label="Filed" color="#1A5276" />
        <SummaryCard value={violationSummary.resolved} label="Resolved" color="#1B7A4A" />
      </div>

      <SectionCard title="Brand Violations">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-[#5C6B7A] uppercase tracking-wider">
              <th className="pb-3">Violation Type</th>
              <th className="pb-3">Date Observed</th>
              <th className="pb-3">Marketplace / URL</th>
              <th className="pb-3">Ticket Status</th>
            </tr>
          </thead>
          <tbody>
            {brandViolations.map((violation, index) => (
              <tr key={index} className="border-t border-[#E8ECF0] align-top">
                <td className="py-3">
                  <span
                    className="inline-block text-white text-xs font-medium px-2 py-0.5 rounded"
                    style={{ backgroundColor: getViolationTypeColor(violation.violationType) }}
                  >
                    {violation.violationType}
                  </span>
                </td>
                <td className="py-3 text-[#1B2A3D]">{violation.dateObserved}</td>
                <td className="py-3">
                  <div className="text-[#1B2A3D] text-xs">{violation.marketplace}</div>
                  <a
                    href={`https://${violation.marketplaceUrl}`}
                    className="text-[#1A5276] text-xs hover:underline"
                  >
                    {violation.marketplaceUrl}
                  </a>
                </td>
                <td className="py-3">
                  <span
                    className="inline-block text-xs font-semibold px-2 py-0.5 rounded border"
                    style={{
                      color: getTicketColor(violation.ticketStatus),
                      borderColor: getTicketColor(violation.ticketStatus),
                      backgroundColor: `${getTicketColor(violation.ticketStatus)}10`,
                    }}
                  >
                    {violation.ticketStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>


    </div>
  )
}

function SummaryCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="border border-[#D1D8E0] rounded p-4 bg-white text-center">
      <p className="text-2xl font-serif font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-[#5C6B7A] mt-1 uppercase tracking-wide font-semibold">{label}</p>
    </div>
  )
}

function getViolationTypeColor(type: string): string {
  const map: Record<string, string> = {
    "Bundled competitor product": "#5B3A8C",
    "Unauthorized logo use": "#1A5276",
    "MAP breach": "#9B1C1C",
  }
  return map[type] ?? "#5C6B7A"
}

function getTicketColor(status: string): string {
  const map: Record<string, string> = {
    "Under Review": "#B07D10",
    Filed: "#1A5276",
    Resolved: "#1B7A4A",
  }
  return map[status] ?? "#5C6B7A"
}
