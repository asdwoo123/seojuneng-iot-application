import XLSX from 'xlsx'

export function excelDownload(items) {
    const dataWS = XLSX.utils.json_to_sheet(items)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, dataWS, 'data')
    XLSX.writeFile(wb, 'data.xlsx')
}


