/* --------------------------------------------------------------------------------------------------*/
/* ---------------------------------------- DOWNLOAD DATA ------------------------------------------ */
/* --------------------------------------------------------------------------------------------------*/

// Convert clients data to PDF format including insights
function convertToPDF(clients) {

    // Calculate insights
    const clientCount = clients.length
    const discountsGotten = clients.reduce((sum, client) => sum + client.discountsGotten, 0)
    const discountsClaimed = clients.reduce((sum, client) => sum + client.discountsClaimed, 0)
    const totalProfit = clients.reduce((sum, client) => sum + client.totalSpent, 0).toFixed(2)
    const overallAverageRating = (clients.reduce((sum, client) => sum + client.averageRating, 0) / clientCount).toFixed(2)
    const overallAverageExpenditure = (clients.reduce((sum, client) => sum + client.averageExpenditure, 0) / clientCount).toFixed(2)
  
    // Initialize jsPDF
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()
  
    // Add title
    doc.setFontSize(18)
    doc.text('Client Insights & Data', 105, 20, null, null, 'center')
  
    // Add insights
    doc.setFontSize(12)
    doc.text('Insights', 20, 30)
    doc.text(`Client Count: ${clientCount}`, 20, 40)
    doc.text(`Discounts Gotten: ${discountsGotten}`, 20, 50)
    doc.text(`Discounts Claimed: ${discountsClaimed}`, 20, 60)
    doc.text(`Total Profit: $${totalProfit}`, 20, 70)
    doc.text(`Overall Average Rating: ${overallAverageRating}`, 20, 80)
    doc.text(`Overall Average Expenditure: $${overallAverageExpenditure}`, 20, 90)
  
    // Return the PDF document
    return doc
}
  
// Convert clients data to CSV format
function convertToCSV(clients) {
    const headers = [
        'Name', 'Phone Number', 'Email', 'Birthdate', 'Last Rating',
        'Average Rating', 'Discount Available', 'Emission Date',
        'Expiration Date', 'Discounts Gotten', 'Discounts Claimed',
        'Total Spent', 'Average Expenditure'
    ]

    const csvRows = [headers.join(',')]

    clients.forEach(client => {
    const row = [
        client.name, client.phoneNumber, client.email, client.birthDate,
        client.lastRating, client.averageRating, client.discountAvailable,
        client.emissionDate, client.expirationDate, client.discountsGotten,
        client.discountsClaimed, client.totalSpent, client.averageExpenditure
    ].join(',')

    csvRows.push(row)
    })

    return csvRows.join('\n')
}
  
// Function to trigger download of PDF file
function downloadPDF(clients) {
    const doc = convertToPDF(clients)
    doc.save('clients_insights.pdf')
}

// Function to trigger download of CSV file
function downloadCSV(clients) {
    const csvContent = convertToCSV(clients)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'clients_data.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
  
// Function to trigger download of PDF file
function downloadPDF(clients) {
    const doc = convertToPDF(clients)
    const blob = doc.output('blob') // Convert the PDF to a Blob
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'clients_insights.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Clean up the URL object after the download
}
  