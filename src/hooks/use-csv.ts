import { format } from 'date-fns'
import { download, generateCsv, mkConfig } from 'export-to-csv'

function reportName(name: string) {
  return name.replace(/_/g, ' ') + '_' + format(new Date(), 'ddMMyyyyHHmmss')
}

export function useExportCsv(fileName?: string) {
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: reportName(fileName || 'generated_data'),
  })

  function handleExport(data: Array<any>) {
    const csv = generateCsv(csvConfig)(data)
    download(csvConfig)(csv)
  }

  return handleExport
}
