import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: ReactNode
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="mb-6 border-b-2 border-[#0F2B46] pb-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#0F2B46]">{title}</h2>
          {subtitle && <p className="text-sm text-[#5C6B7A] mt-1 font-sans">{subtitle}</p>}
        </div>
        {badge && <div>{badge}</div>}
      </div>
    </div>
  )
}
