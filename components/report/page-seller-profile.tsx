import React from "react"
import { SectionCard } from "./section-card"
import { PageHeader } from "./page-header"
import { ExternalLink, MapPin } from "lucide-react"
import type { SellerReport } from "@/lib/report-data"

interface PageSellerProfileProps {
  data: SellerReport
}

export function PageSellerProfile({ data }: PageSellerProfileProps) {
  const { profile, marketplacePresence, catalogProfile } = data

  return (
    <div className="report-page">
      <PageHeader
        title="Seller Details"
        subtitle="Comprehensive seller profile and marketplace presence"
      />

      {/* Profile Section */}
      <SectionCard title="Profile">
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          {/* Left Column */}
          <div className="space-y-3">
            <ProfileField label="Reseller Name">
              <span className="inline-block bg-[#0F2B46] text-white text-sm font-semibold px-3 py-1 rounded">
                {profile.resellerName}
              </span>
            </ProfileField>

            <ProfileField label="Business Name">
              <FieldValue>{profile.businessName}</FieldValue>
            </ProfileField>

            <ProfileField label="Business Address">
              <FieldValue>{profile.businessAddress}</FieldValue>
            </ProfileField>

            <ProfileField label="Business E-mail">
              <FieldValue>{profile.businessEmail}</FieldValue>
            </ProfileField>

            <ProfileField label="Business Contact #">
              <FieldValue>{profile.businessContact}</FieldValue>
            </ProfileField>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <ProfileField label="Business Point of Contact">
              <FieldValue>{profile.businessPointOfContact}</FieldValue>
            </ProfileField>

            <ProfileField label="Business Website">
              <a
                href={profile.businessWebsite}
                className="inline-flex items-center gap-1 text-sm text-[#1A5276] hover:underline"
              >
                {profile.businessWebsite}
                <ExternalLink className="h-3 w-3" />
              </a>
            </ProfileField>

            <ProfileField label="Business Established Date">
              <FieldValue>{profile.businessEstablishedDate}</FieldValue>
            </ProfileField>

            {profile.supportingLinks.length > 0 && (
              <ProfileField label="Supporting Links">
                <div className="flex flex-wrap gap-2">
                  {profile.supportingLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      className="inline-flex items-center gap-1 text-xs text-[#1A5276] bg-[#F0F4F8] px-2 py-1 rounded border border-[#D1D8E0] hover:underline"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </ProfileField>
            )}

            <ProfileField label="Location on Map">
              <div className="bg-[#F7F8FA] rounded p-3 flex flex-col items-center justify-center border border-[#D1D8E0]">
                <MapPin className="h-5 w-5 text-[#9B1C1C] mb-1" />
                <p className="text-xs font-medium text-[#1B2A3D]">Google Map Preview</p>
                <p className="text-xs text-[#1A5276]">
                  Lat: {profile.location.lat}, Long: {profile.location.lng}
                </p>
              </div>
              <span className="inline-block bg-[#F7F8FA] text-[#1B2A3D] text-xs px-2 py-1 rounded border border-[#D1D8E0] mt-2">
                {profile.businessAddress}
              </span>
            </ProfileField>
          </div>
        </div>
      </SectionCard>

      {/* Marketplace Presence */}
      <SectionCard title="Presence on Marketplaces">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-[#5C6B7A] uppercase tracking-wider">
              <th className="pb-3">Marketplace</th>
              <th className="pb-3">Seller Name</th>
              <th className="pb-3">First Seen</th>
              <th className="pb-3">Last Seen</th>
              <th className="pb-3"># Active Listings</th>
              <th className="pb-3">Aliases</th>
            </tr>
          </thead>
          <tbody>
            {marketplacePresence.map((mp) => (
              <tr key={mp.marketplace} className="border-t border-[#E8ECF0]">
                <td className="py-3">
                  <span
                    className="inline-block text-white text-xs font-medium px-2 py-0.5 rounded"
                    style={{ backgroundColor: mp.color }}
                  >
                    {mp.marketplace}
                  </span>
                </td>
                <td className="py-3">
                  <a
                    href={mp.storefrontUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#1A5276] font-medium hover:underline"
                  >
                    {mp.sellerName}
                    <ExternalLink className="h-3.5 w-3.5 text-[#5C6B7A]" />
                  </a>
                </td>
                <td className="py-3 text-[#1B2A3D]">{mp.firstSeen}</td>
                <td className="py-3 text-[#1B2A3D]">{mp.lastSeen}</td>
                <td className="py-3 text-[#0F2B46] font-semibold">{mp.activeListings}</td>
                <td className="py-3">
                  {mp.aliases.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {mp.aliases.map((alias) => (
                        <span
                          key={alias}
                          className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-[#FDF6E3] text-[#7C5E10] border border-[#E8D5A3]"
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-[#A0AAB4]">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* Assortment by Category */}
      <SectionCard title="Assortment Breakdown by Category">
        <div className="flex flex-wrap gap-2 mb-5">
          {catalogProfile.categories.map((cat) => (
            <span
              key={cat}
              className="inline-block bg-[#0F2B46] text-white text-xs font-medium px-3 py-1 rounded"
            >
              {cat}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {catalogProfile.categories.map((cat) => {
            const skuCount = getCategorySkuCount(cat, catalogProfile.brandSkusCarried, catalogProfile.categories.length)
            return (
              <div
                key={cat}
                className="flex items-center justify-between bg-[#F7F8FA] border border-[#D1D8E0] rounded px-4 py-3"
              >
                <span className="text-sm font-medium text-[#1B2A3D]">{cat}</span>
                <span className="text-sm font-bold text-[#0F2B46]">{skuCount} SKUs</span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-[#D1D8E0] flex items-center justify-between">
          <span className="text-sm font-medium text-[#5C6B7A]">Total Brand SKUs Captured</span>
          <span className="text-lg font-bold text-[#0F2B46]">{catalogProfile.brandSkusCarried}</span>
        </div>
      </SectionCard>
    </div>
  )
}

function ProfileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1">{label}</p>
      {children}
    </div>
  )
}

function FieldValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-[#F7F8FA] text-[#1B2A3D] text-sm px-2 py-1 rounded border border-[#D1D8E0]">
      {children}
    </span>
  )
}

function getCategorySkuCount(category: string, totalSkus: number, totalCategories: number): number {
  const distribution: Record<string, number> = {
    Controllers: 6,
    Headsets: 5,
    "Charging Docks": 4,
    "Cables & Adapters": 4,
  }
  return distribution[category] ?? Math.round(totalSkus / totalCategories)
}
