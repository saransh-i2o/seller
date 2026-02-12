import React from "react"
interface SectionCardProps {
  title: string
  children: React.ReactNode
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="border border-[#D1D8E0] rounded bg-white mb-5 overflow-hidden">
      <div className="px-5 py-3 border-b border-[#D1D8E0] bg-[#F7F8FA]">
        <h3 className="text-sm font-serif font-bold text-[#0F2B46] uppercase tracking-wide">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}
