export function reportFixes(report: { issues: any[] }) {
    console.log('\n🛠️ Fixes Applied:\n')
    console.table(report.issues)
  }