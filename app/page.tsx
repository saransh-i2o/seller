import { ReportShell } from "@/components/report/report-shell"
import { sampleReport } from "@/lib/report-data"

export default function Page() {
  return <ReportShell data={sampleReport} />
}
