"use client"

import { useRef, useState } from "react"
import { ReportBanner } from "./report-banner"
import { PageSellerProfile } from "./page-seller-profile"
import { PageEnforcement } from "./page-enforcement"
import { PageViolations } from "./page-violations"
import { PageAnalytics } from "./page-analytics"
import { Download, Printer, ChevronLeft, ChevronRight, FileJson } from "lucide-react"
import type { SellerReport } from "@/lib/report-data"

interface ReportShellProps {
  data: SellerReport
}

const PAGE_LABELS = [
  "Seller Profile",
  "Enforcement History",
  "Brand Violations",
  "Seller Analytics",
]

export function ReportShell({ data }: ReportShellProps) {
  const reportRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [generating, setGenerating] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadJrxml = () => {
    const jrxmlTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd"
  name="SellerInvestigationReport" pageWidth="595" pageHeight="842" columnWidth="535" leftMargin="30" rightMargin="30" topMargin="30" bottomMargin="30">
  <style name="Base" isDefault="true" fontName="Arial" fontSize="10"/>
  <style name="Title" forecolor="#0F2B46" fontName="Arial" fontSize="20" isBold="true"/>
  <style name="Heading" forecolor="#0F2B46" fontName="Arial" fontSize="14" isBold="true"/>
  <style name="SubHeading" forecolor="#5C6B7A" fontName="Arial" fontSize="11"/>
  <parameter name="ReportTitle" class="java.lang.String"/>
  <parameter name="BusinessName" class="java.lang.String"/>
  <parameter name="GeneratedDate" class="java.lang.String"/>
  <field name="sellerName" class="java.lang.String"/>
  <field name="marketplaceName" class="java.lang.String"/>
  <field name="violationType" class="java.lang.String"/>
  <field name="dateObserved" class="java.lang.String"/>
  <group name="SellerGroup">
    <groupExpression><![CDATA[\$F{sellerName}]]></groupExpression>
  </group>
  <pageHeader>
    <band height="80" splitType="Stretch">
      <rectangle>
        <reportElement x="0" y="0" width="535" height="80" backcolor="#0F2B46"/>
      </rectangle>
      <staticText>
        <reportElement style="Title" x="20" y="20" width="495" height="30"/>
        <text><![CDATA[Seller Investigation Report]]></text>
      </staticText>
      <textField>
        <reportElement style="SubHeading" x="20" y="50" width="495" height="20"/>
        <textFieldExpression><![CDATA[\$P{BusinessName}]]></textFieldExpression>
      </textField>
    </band>
  </pageHeader>
  <pageFooter>
    <band height="20" splitType="Stretch">
      <line>
        <reportElement x="0" y="10" width="535" height="1" forecolor="#D1D8E0"/>
      </line>
      <textField evaluationTime="Report">
        <reportElement x="450" y="0" width="85" height="20" style="Base"/>
        <textAlignment horizontalAlignment="Right"/>
        <textFieldExpression><![CDATA["Page " + \$V{PAGE_NUMBER}]]></textFieldExpression>
      </textField>
      <staticText>
        <reportElement style="Base" x="20" y="0" width="430" height="20" forecolor="#5C6B7A"/>
        <text><![CDATA[Powered by i2o Technologies | Confidential]]></text>
      </staticText>
    </band>
  </pageFooter>
  <detail>
    <band height="100" splitType="Stretch">
      <textField>
        <reportElement style="Heading" x="20" y="10" width="495" height="20"/>
        <textFieldExpression><![CDATA[\$F{sellerName}]]></textFieldExpression>
      </textField>
      <textField>
        <reportElement style="SubHeading" x="20" y="35" width="200" height="15"/>
        <textFieldExpression><![CDATA["Marketplace: " + \$F{marketplaceName}]]></textFieldExpression>
      </textField>
      <textField>
        <reportElement style="SubHeading" x="220" y="35" width="295" height="15"/>
        <textFieldExpression><![CDATA["Violation: " + \$F{violationType}]]></textFieldExpression>
      </textField>
      <textField>
        <reportElement style="SubHeading" x="20" y="55" width="495" height="15"/>
        <textFieldExpression><![CDATA["Date Observed: " + \$F{dateObserved}]]></textFieldExpression>
      </textField>
    </band>
  </detail>
</jasperReport>`

    const blob = new Blob([jrxmlTemplate], { type: "application/xml" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Seller_Investigation_${data.profile.resellerName}_${data.reportGeneratedDate.replace(/\s/g, "_")}.jrxml`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return
    setGenerating(true)

    try {
      const html2canvasModule = await import("html2canvas")
      const html2canvas = html2canvasModule.default ?? html2canvasModule
      const jspdfModule = await import("jspdf")
      const jsPDF = jspdfModule.jsPDF ?? jspdfModule.default

      const reportEl = reportRef.current

      // Make all pages visible for capture
      const pageWrappers = reportEl.querySelectorAll<HTMLElement>("[data-page-wrapper]")
      pageWrappers.forEach((el) => {
        el.style.display = "block"
      })

      // Wait for layout to settle
      await new Promise((r) => setTimeout(r, 500))

      const pages = reportEl.querySelectorAll<HTMLElement>(".report-page")
      if (pages.length === 0) {
        console.error("[v0] No .report-page elements found")
        return
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Capture banner
      const bannerEl = reportEl.querySelector(".report-banner") as HTMLElement
      let bannerImgData: string | null = null
      let bannerRatio = 0

      if (bannerEl) {
        const bannerCanvas = await html2canvas(bannerEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#0F2B46",
        })
        bannerImgData = bannerCanvas.toDataURL("image/png")
        bannerRatio = bannerCanvas.height / bannerCanvas.width
      }

      const bannerHeightMm = bannerImgData ? pdfWidth * bannerRatio : 0
      const margin = 6
      const footerHeight = 10
      const contentWidth = pdfWidth - margin * 2
      let totalPdfPages = 0

      // First pass: count total PDF pages needed
      const pageSplits: number[] = []
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#FFFFFF",
          windowWidth: 900,
        })
        const imgRatio = canvas.height / canvas.width
        const imgHeightMm = contentWidth * imgRatio
        const availableFirst = pdfHeight - bannerHeightMm - 3 - footerHeight
        const availableNext = pdfHeight - bannerHeightMm - 3 - footerHeight

        if (imgHeightMm <= availableFirst) {
          pageSplits.push(1)
        } else {
          const remaining = imgHeightMm - availableFirst
          const extraPages = Math.ceil(remaining / availableNext)
          pageSplits.push(1 + extraPages)
        }
      }
      totalPdfPages = pageSplits.reduce((a, b) => a + b, 0)

      // Second pass: render pages
      let currentPdfPage = 0
      let isFirstPdfPage = true

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#FFFFFF",
          windowWidth: 900,
        })

        const imgData = canvas.toDataURL("image/png")
        const imgRatio = canvas.height / canvas.width
        const imgHeightMm = contentWidth * imgRatio
        const availableHeight = pdfHeight - bannerHeightMm - 3 - footerHeight

        // Number of PDF pages this content section needs
        let yImageOffset = 0
        let sliceIndex = 0

        while (yImageOffset < imgHeightMm) {
          if (!isFirstPdfPage) {
            pdf.addPage()
          }
          isFirstPdfPage = false
          currentPdfPage++

          // Draw banner on every PDF page
          if (bannerImgData) {
            pdf.addImage(bannerImgData, "PNG", 0, 0, pdfWidth, bannerHeightMm)
          }

          const yStart = bannerHeightMm + 3
          const sliceHeight = Math.min(availableHeight, imgHeightMm - yImageOffset)

          // Calculate source crop in canvas pixels
          const canvasPixelsPerMm = canvas.width / contentWidth
          const srcY = yImageOffset * canvasPixelsPerMm
          const srcH = sliceHeight * canvasPixelsPerMm

          // Use a temporary canvas to crop the section
          const tempCanvas = document.createElement("canvas")
          tempCanvas.width = canvas.width
          tempCanvas.height = Math.ceil(srcH)
          const tempCtx = tempCanvas.getContext("2d")
          if (tempCtx) {
            tempCtx.drawImage(
              canvas,
              0, Math.floor(srcY), canvas.width, Math.ceil(srcH),
              0, 0, canvas.width, Math.ceil(srcH)
            )
          }
          const sliceData = tempCanvas.toDataURL("image/png")
          pdf.addImage(sliceData, "PNG", margin, yStart, contentWidth, sliceHeight)

          // Footer
          pdf.setFontSize(7)
          pdf.setTextColor(140, 140, 140)
          pdf.text(
            `Page ${currentPdfPage} of ${totalPdfPages}  |  Seller Investigation Report - ${data.profile.resellerName}  |  Generated ${data.reportGeneratedDate}  |  CONFIDENTIAL`,
            pdfWidth / 2,
            pdfHeight - 4,
            { align: "center" }
          )

          yImageOffset += sliceHeight
          sliceIndex++
        }
      }

      // Restore visibility to current page only
      pageWrappers.forEach((el, idx) => {
        el.style.display = idx === currentPage ? "block" : "none"
      })

      pdf.save(`Seller_Investigation_${data.profile.resellerName}_${data.reportGeneratedDate.replace(/\s/g, "_")}.pdf`)
    } catch (error) {
      console.error("[v0] PDF generation error:", error)
      alert("Failed to generate PDF. Please try the Print option instead.")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EAEDF1]">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#D1D8E0] shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#0F2B46] text-white font-serif font-bold text-lg px-3 py-1 rounded">i2o</div>
            <div>
              <h1 className="text-sm font-serif font-bold text-[#0F2B46]">Seller Investigation Report</h1>
              <p className="text-xs text-[#5C6B7A]">{data.profile.resellerName} - {data.profile.businessName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[#D1D8E0] rounded px-2 py-1">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-1 rounded hover:bg-[#E8ECF0] disabled:opacity-30 disabled:cursor-not-allowed text-[#1B2A3D]"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-[#1B2A3D] min-w-[120px] text-center">
                {PAGE_LABELS[currentPage]} ({currentPage + 1}/{PAGE_LABELS.length})
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(PAGE_LABELS.length - 1, currentPage + 1))}
                disabled={currentPage === PAGE_LABELS.length - 1}
                className="p-1 rounded hover:bg-[#E8ECF0] disabled:opacity-30 disabled:cursor-not-allowed text-[#1B2A3D]"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[#1B2A3D] bg-[#F7F8FA] border border-[#D1D8E0] rounded hover:bg-[#E8ECF0] transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={handleDownloadJrxml}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[#1B2A3D] bg-[#F7F8FA] border border-[#D1D8E0] rounded hover:bg-[#E8ECF0] transition-colors"
            >
              <FileJson className="h-4 w-4" />
              Download JRXML
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={generating}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-[#0F2B46] rounded hover:bg-[#163B5C] transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {generating ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="max-w-5xl mx-auto">
        <div className="report-banner mt-6 print:mt-0 rounded-t overflow-hidden print:rounded-none">
          <ReportBanner reportGeneratedDate={data.reportGeneratedDate} />
        </div>

        <div className="bg-white rounded-b shadow-lg print:shadow-none print:rounded-none">
          {/* Confidential bar */}
          <div className="px-6 py-1.5 bg-[#F7F8FA] border-b border-[#D1D8E0] text-center">
            <span className="text-[10px] font-semibold text-[#9B1C1C] uppercase tracking-[0.2em]">
              Confidential - For Authorized Use Only
            </span>
          </div>

          {/* Page navigation tabs */}
          <div className="flex border-b border-[#D1D8E0] print:hidden">
            {PAGE_LABELS.map((label, index) => (
              <button
                key={label}
                onClick={() => setCurrentPage(index)}
                className={`flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  currentPage === index
                    ? "text-[#0F2B46] border-b-2 border-[#0F2B46] bg-[#F0F4F8]"
                    : "text-[#5C6B7A] hover:text-[#1B2A3D] hover:bg-[#F7F8FA]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Page content */}
          <div className="p-6 print:p-4">
            <div data-page-wrapper style={{ display: currentPage === 0 ? "block" : "none" }} className="print:!block">
              <PageSellerProfile data={data} />
            </div>
            <div data-page-wrapper style={{ display: currentPage === 1 ? "block" : "none" }} className="print:!block print:break-before-page">
              <PageEnforcement data={data} />
            </div>
            <div data-page-wrapper style={{ display: currentPage === 2 ? "block" : "none" }} className="print:!block print:break-before-page">
              <PageViolations data={data} />
            </div>
            <div data-page-wrapper style={{ display: currentPage === 3 ? "block" : "none" }} className="print:!block print:break-before-page">
              <PageAnalytics data={data} />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#D1D8E0] flex items-center justify-between text-xs text-[#5C6B7A]">
            <span className="font-serif font-bold text-[#0F2B46]">Powered by i2o Technologies</span>
            <span>
              Report generated on {data.reportGeneratedDate} | {data.profile.resellerName} | Confidential
            </span>
          </div>
        </div>

        <div className="h-6 print:hidden" />
      </div>
    </div>
  )
}
