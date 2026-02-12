import { SectionCard } from "./section-card"
import { PageHeader } from "./page-header"
import { ExternalLink, Download, FileText } from "lucide-react"
import type { SellerReport, CommunicationNotice } from "@/lib/report-data"

interface PageEnforcementProps {
  data: SellerReport
}

function groupByMarketplace(communications: CommunicationNotice[]) {
  const groups: Record<string, { color: string; notices: CommunicationNotice[]; viewCorrespondenceUrl: string }> = {}
  for (const comm of communications) {
    if (!groups[comm.marketplace]) {
      groups[comm.marketplace] = {
        color: comm.marketplaceColor,
        notices: [],
        viewCorrespondenceUrl: comm.viewCorrespondenceUrl,
      }
    }
    groups[comm.marketplace].notices.push(comm)
  }
  return groups
}

export function PageEnforcement({ data }: PageEnforcementProps) {
  const { communications, invoices, testBuyOrders } = data
  const grouped = groupByMarketplace(communications)

  return (
    <div className="report-page">
      <PageHeader title="Enforcement History" subtitle="Communications, notices, and test purchase records" />

      <SectionCard title="Communications &amp; Notices">
        <div className="space-y-6">
          {Object.entries(grouped).map(([marketplace, group]) => (
            <div key={marketplace}>
              {/* Marketplace header row */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D1D8E0]">
                <span
                  className="inline-block text-white text-xs font-semibold px-2.5 py-1 rounded"
                  style={{ backgroundColor: group.color }}
                >
                  {marketplace}
                </span>
                <a
                  href={group.viewCorrespondenceUrl}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A5276] hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" />
                  View Correspondence
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Notices table for this marketplace */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-[#5C6B7A] uppercase tracking-wider">
                    <th className="pb-2">Notice</th>
                    <th className="pb-2">Message Type</th>
                    <th className="pb-2">Sent On</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {group.notices.map((comm, idx) => (
                    <tr key={idx} className="border-t border-[#E8ECF0]">
                      <td className="py-2.5">
                        <span className="inline-block bg-[#E8EFF6] text-[#0F2B46] text-xs font-medium px-2 py-0.5 rounded border border-[#C4D1DC]">
                          {comm.notice}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className="inline-block bg-[#F7F8FA] text-[#1B2A3D] text-xs px-2 py-0.5 rounded border border-[#D1D8E0]">
                          {comm.messageType}
                        </span>
                      </td>
                      <td className="py-2.5 text-[#1B2A3D]">{comm.sentOn}</td>
                      <td className="py-2.5">
                        <span className="text-xs font-semibold" style={{ color: getStatusColor(comm.status) }}>
                          {comm.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

      </SectionCard>

      {invoices.length > 0 && (
        <SectionCard title="Invoices Received">
          <p className="text-xs text-[#5C6B7A] mb-3">
            Invoices received as part of Proof of Purchase or Policy Violation responses.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-[#5C6B7A] uppercase tracking-wider">
                <th className="pb-3">Marketplace</th>
                <th className="pb-3">Invoice ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">View</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-[#E8ECF0]">
                  <td className="py-3">
                    <span
                      className="inline-block text-white text-xs font-medium px-2 py-0.5 rounded"
                      style={{ backgroundColor: inv.marketplaceColor }}
                    >
                      {inv.marketplace}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs text-[#1A5276]">{inv.id}</td>
                  <td className="py-3 text-[#1B2A3D]">{inv.date}</td>
                  <td className="py-3 text-[#1B2A3D]">{inv.type}</td>
                  <td className="py-3">
                    <a href={inv.url} className="inline-flex items-center gap-1 text-[#1A5276] text-xs hover:underline">
                      <Download className="h-3 w-3" />
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      <SectionCard title="Test Buy Orders">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-[#5C6B7A] uppercase tracking-wider">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Marketplace</th>
              <th className="pb-3">Product Code</th>
              <th className="pb-3">Ordered On</th>
              <th className="pb-3">Received On</th>
              <th className="pb-3">Download Package</th>
            </tr>
          </thead>
          <tbody>
            {testBuyOrders.map((order) => (
              <tr key={order.orderId} className="border-t border-[#E8ECF0]">
                <td className="py-3">
                  <span className="text-[#1A5276] font-medium">{order.orderId}</span>
                </td>
                <td className="py-3">
                  <span
                    className="inline-block text-white text-xs font-medium px-2 py-0.5 rounded"
                    style={{ backgroundColor: order.marketplaceColor }}
                  >
                    {order.marketplace}
                  </span>
                </td>
                <td className="py-3 font-mono text-xs text-[#1B2A3D]">{order.productCode}</td>
                <td className="py-3 text-[#1B2A3D]">{order.orderedOn}</td>
                <td className="py-3 text-[#1B2A3D]">{order.receivedOn}</td>
                <td className="py-3">
                  <a
                    href={order.downloadPackageUrl}
                    className="inline-flex items-center gap-1.5 text-[#1A5276] text-xs font-medium hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 pt-3 border-t border-[#E8ECF0]">
          <p className="text-xs text-[#5C6B7A]">
            Click the download link to retrieve the complete test purchase package including photos, receipts, and analysis.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    Opened: "#B07D10",
    Delivered: "#1B7A4A",
    Verified: "#1B7A4A",
    Pending: "#B07D10",
  }
  return map[status] ?? "#5C6B7A"
}


