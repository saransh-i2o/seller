interface ReportBannerProps {
  reportGeneratedDate?: string
}

export function ReportBanner({ reportGeneratedDate }: ReportBannerProps) {
  return (
    <div className="w-full bg-[#0F2B46] flex items-center justify-between px-8 py-4 print:py-3">
      <span className="text-white font-serif font-bold text-2xl tracking-wide">i2o</span>
      <div className="text-right">
        <div className="text-white/70 text-sm font-sans font-medium tracking-wide uppercase">
          Seller Investigation Report
        </div>
        {reportGeneratedDate && (
          <div className="text-white/50 text-xs font-sans mt-1">
            Report generated on {reportGeneratedDate}
          </div>
        )}
      </div>
    </div>
  )
}
