// FRONTEND | Dashboard

/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DATABASE CONNECTION -------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// const apiUrl = 'http://localhost:3089'
// const apiUrl = 'https://lattefy-server.glitch.me'
const apiUrl = 'https://backend-5v26.onrender.com'

// Fetch all clients
async function getAll() {
  try {
    const response = await fetch(`${apiUrl}/clients`)
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error('Error fetching clients:', error)
    return []
  }
}

// Authenticate email
function authenticateEmail(clients, email) {
  return !clients.some(client => client.email === email)
}

// Get client by email
function getClientByEmail(clients, email) {
  return clients.find(client => client.email === email)
}

// Update client
async function updateClient(email, updates) {
  try {
    const response = await fetch(`${apiUrl}/clients/${email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const data = await response.json()
    console.log('Client updated:', data)
  } catch (error) {
    console.error('Error updating client:', error)
  }
}

/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DASHBOARD INSIGHTS --------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// Display the amount of clients
function displayClientCount(clients) {
  const clientAmount = document.getElementById('client-amount')
  clientAmount.textContent = clients.length 
}

// Display discounts gotten
function displayDiscountsGotten(clients) {
  const allDiscountsGotten = clients.map(client => client.discountsGotten)

  let discountGottenSum = 0
  for (let i = 0; i < allDiscountsGotten.length; i++) {
    discountGottenSum += allDiscountsGotten[i]
  }

  const discountsGottenOutput = document.getElementById('discounts-gotten')
  discountsGottenOutput.textContent = discountGottenSum
}

// Display discounts claimed
function displayDiscountsClaimed(clients) {
  const allDiscountsClaimed = clients.map(client => client.discountsClaimed)

  let discountsClaimedSum = 0
  for (let i = 0; i < allDiscountsClaimed.length; i++) {
    discountsClaimedSum += allDiscountsClaimed[i]
  }

  const discountsClaimedOutput = document.getElementById('discounts-claimed')
  discountsClaimedOutput.textContent = discountsClaimedSum
}

// Calculate Overall Average Rating
function sentimentAnalysis(clients) {
  const allRatings = clients.map(client => client.averageRating)

  let ratingSum = 0
  for (let i = 0; i < allRatings.length; i++) {
    ratingSum += allRatings[i]
  }

  const overallRating = ratingSum / clients.length
  
  const sentimentOutput = document.getElementById('sentiment-analysis')
  sentimentOutput.textContent = overallRating.toFixed(2)
}

// Calculate Overall Average Expenditure
function displayAverageExpenditure(clients) {
  const allExpenditures = clients.map(client => client.averageExpenditure)
  const allDiscountsClaimed = clients.map(client => client.discountsClaimed)

  let expenditureSum = 0
  for (let i = 0; i < allExpenditures.length; i++) {
    expenditureSum += allExpenditures[i]
  }

  let discountsClaimedSum = 0
  for (let i = 0; i < allDiscountsClaimed.length; i++) {
    discountsClaimedSum += allDiscountsClaimed[i]
  }

  const overallExpenditure = expenditureSum / discountsClaimedSum
  
  const expenditureOutput = document.getElementById('average-expenditure')
  expenditureOutput.textContent = "$" + overallExpenditure.toFixed(2)
}

// Display Total Profit
function displayTotalProfit(clients) {
  const allTotals = clients.map(client => client.totalSpent)

  let totalSum = 0
  for (let i = 0; i < allTotals.length; i++) {
    totalSum += allTotals[i]
  }
  
  const totalOutput = document.getElementById('total-profit')
  totalOutput.textContent = "$" + totalSum.toFixed(2)
}

/* --------------------------------------------------------------------------------------------------*/
/* ---------------------------------------- DISPLAY CLIENTS ---------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// Display all clients in a table
function displayClients(clients) {
  const clientOutput = document.getElementById('allClients')
  const fieldsToAvoid = [
    '_id', 'lastrating', 'emissiondate', 'expirationdate', 'discountsgotten', 'discountavailable', 'totalspent', '__v'
  ]

  clients.forEach(client => {
    const row = document.createElement('tr')

    Object.entries(client).forEach(([key, value]) => {
      if (!fieldsToAvoid.includes(key.toLowerCase())) {
        const cell = document.createElement('td')
        cell.textContent = value
        cell.setAttribute('data-label', capitalizeFirstLetter(key))
        row.appendChild(cell)
      }
    })

    clientOutput.appendChild(row)
  })
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/* --------------------------------------------------------------------------------------------------*/
/* ---------------------------------------- UPLOAD PURCHASE ---------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// Calculate dates
function calculateDate(days) {
  const today = new Date()
  const date = new Date(today)
  date.setDate(today.getDate() + days)
  return date
}

// Function to check if a date is expired
function isDateExpired(date) {
  const currentDate = new Date()
  console.log(`Current Date: ${currentDate}`)
  return date < currentDate
}

// Upload Purchase
async function uploadPurchase(email, amountSpentNow) {
  const clients =  await getAll()
  const client = getClientByEmail(clients, email)
  if (client) {
    const amountSpentNowNum = parseFloat(amountSpentNow)
    if (isNaN(amountSpentNowNum)) {
      console.error('Invalid amount spent:', amountSpentNow)
      return
    }

    const totalExpenditure = client.totalSpent + amountSpentNowNum
    const discountsClaimed = client.discountsClaimed + 1
    let averageExpenditure

    if (client.discountsGotten == 1) {
      averageExpenditure = totalExpenditure
    } else {
      averageExpenditure = totalExpenditure / client.discountsGotten
    }

    const updates = {}

    // Authenticate a discount

    const expirationDate = new Date(client.expirationDate) 
    const expired = isDateExpired(expirationDate)

    console.log(`Expiration Date: ${expirationDate}`)
    console.log(expired)

    if (client.discountAvailable) {
      if (expired) {
        alert('El descuento esta vencido')
      } else {
        updates.discountAvailable = false
        updates.emissionDate = calculateDate(1)
        updates.expirationDate = calculateDate(31)

        updates.discountsClaimed = discountsClaimed
        updates.totalSpent = totalExpenditure
        updates.averageExpenditure = averageExpenditure.toFixed(2)

        await updateClient(email, updates)
        alert('Se ha cargado la compra con exito')
      }
    } else {
      alert('No hay descuento disponible')
    }
  } else {
    alert('No se ha encontrado el cliente')
  }
}



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




/* --------------------------------------------------------------------------------------------------*/
/* ---------------------------------------- LOAD FUNCTIONS ----------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {
  const clients = await getAll()

  // Dashboard
  if (document.getElementById('dashboard')) {
    displayClientCount(clients)
    displayDiscountsGotten(clients)
    displayDiscountsClaimed(clients)
    sentimentAnalysis(clients)
    displayAverageExpenditure(clients)
    displayTotalProfit(clients)
  }

  // Clients
  if (document.getElementById('clients')) {
    displayClients(clients)
  }

  // Purchase 
  if (document.getElementById('purchase')) {
    // Purchase Upload
    const purchaseBtn = document.getElementById('purchase-btn')
    purchaseBtn.addEventListener('click', function () {
      const email = document.getElementById('email').value
      const amountSpentNow = parseFloat(document.getElementById('amount-spent').value)
      uploadPurchase(email, amountSpentNow)
    })
  }

  // Export PDF and CSV
  const exportBtn = document.getElementById('export-btn')
  exportBtn.addEventListener('click', function () {
    downloadPDF(clients)
    downloadCSV(clients)
  })

})
