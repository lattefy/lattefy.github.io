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

function initializeSortAndFilter(clients) {

  // Sort and filter elements
  const sortVariable = document.getElementById('sort-variable')
  const sortOrder = document.getElementById('sort-order')
  const filterVariable = document.getElementById('filter-variable')
  const filterCondition = document.getElementById('filter-condition')
  const filterValue = document.getElementById('filter-value')
  const applyBtn = document.getElementById('apply-btn')
  const resetBtn = document.getElementById('reset-btn')

  function applySortAndFilter() {
    let sortedFilteredClients = [...clients]

    // Apply filtering
    const filterVar = filterVariable.value
    const filterCond = filterCondition.value
    const filterVal = filterValue.value.toLowerCase()

    if (filterVal) {
      sortedFilteredClients = sortedFilteredClients.filter(client => {
        const value = client[filterVar]?.toString().toLowerCase() || ''
        return filterCond === 'contains' ? value.includes(filterVal) : !value.includes(filterVal)
      })
    }

    // Apply sorting
    const sortVar = sortVariable.value
    const sortOrd = sortOrder.value

    sortedFilteredClients.sort((a, b) => {
      const aValue = a[sortVar]
      const bValue = b[sortVar]
      if (aValue < bValue) return sortOrd === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrd === 'asc' ? 1 : -1
      return 0
    })

    displayClients(sortedFilteredClients)
  }

  // Apply sorting and filtering when the apply button is clicked
  applyBtn.addEventListener('click', applySortAndFilter)

  // Reset filters and sorting
  resetBtn.addEventListener('click', function () {
    filterVariable.value = 'name'
    filterCondition.value = 'contains'
    filterValue.value = ''
    sortVariable.value = 'name'
    sortOrder.value = 'asc'
    displayClients(clients)
  })

  function displayClients(clients) {
    const clientOutput = document.getElementById('allClients')
    clientOutput.innerHTML = ''
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

  // Initial display
  displayClients(clients)
}


/* ----------------------------------------- Dashboard Table -------------------------------------- */

function displayClients(clients) {
  const clientOutput = document.getElementById('allClients')
  clientOutput.innerHTML = ''
  const fieldsToAvoid = [
    '_id', 'lastrating', 'emissiondate', 'expirationdate', 'discountsclaimed', 'discountsgotten', 'discountavailable', 'totalspent', 'averageexpenditure', '__v'
  ]

  let rows = clients.map(client => {
    let row = '<tr>'
    Object.entries(client).forEach(([key, value]) => {
      if (!fieldsToAvoid.includes(key.toLowerCase())) {
        row += `<td data-label="${capitalizeFirstLetter(key)}">${value}</td>`
      }
    })
    row += '</tr>'
    return row
  }).join('')
  
  clientOutput.innerHTML = rows
  
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}



/* ------------------------------------------------------------------------------------------------- */
/* ---------------------------------------- UPLOAD PURCHASE ---------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

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
        alert('El descuento esta vencido.')
      } else {
        updates.discountAvailable = false
        updates.emissionDate = calculateDate(1)
        updates.expirationDate = calculateDate(31)

        updates.discountsClaimed = discountsClaimed
        updates.totalSpent = totalExpenditure
        updates.averageExpenditure = averageExpenditure.toFixed(2)

        await updateClient(email, updates)
        alert('Se ha cargado la compra con exito!')
      }
    } else {
      alert('No hay descuento disponible.')
    }
  } else {
    alert('No se ha encontrado el cliente.')
  }
}



/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------------------- CAMPAIGNS ------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

// Function to send emails using EmailJS
async function sendCampaignEmail(clients, title, content, imageUrl) {

  try {
    for (const client of clients) {
      if (!client.email) {
        console.error(`Missing email for client: ${client.name}`)
        continue
      }

      const templateParams = {
        to_email: client.email,
        name: client.name,
        title: title,
        content: content,
        image_url: imageUrl || ''
      }

      await emailjs.send("service_w0y5b66", "template_d029ld1", templateParams)

    }
    alert('Campaña enviada con exito!')
  } catch (error) {
    console.error('Error sending campaign emails:', error)
    alert('Error al enviar la campaña.')
  }

}

// Function to upload images to Cloudinary
async function uploadImageToCloudinary(imageFile) {
  const formData = new FormData()
  formData.append('file', imageFile)
  formData.append('upload_preset', 'my_unsigned_preset')

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/djassgqhi/image/upload', {
      method: 'POST',
      body: formData
    })
    const data = await response.json()

    if (response.ok) {
      return data.secure_url
    } else {
      throw new Error(data.error.message)
    }
  } catch (error) {
    console.error('Error uploading the image:', error)
    alert('Error al cargar el archivo.')
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

  // Loader
  if (
    document.getElementById('dashboard') || 
    document.getElementById('clients') ||
    document.getElementById('stats') ||
    document.getElementById('campaigns') ||
    document.getElementById('download')
  ) {
    var loader = document.getElementById("loader")
    loader.style.display = "none"
  }

  // Dashboard
  if (document.getElementById('dashboard')) {
    displayClients(clients)
    displayClientCount(clients)
    sentimentAnalysis(clients)
    displayTotalProfit(clients)
  }

  // Clients
  if (document.getElementById('clients')) {
    initializeSortAndFilter(clients)
  }

  // Purchase 
  if (document.getElementById('purchase')) {

    // Purchase Upload
    const purchaseBtn = document.getElementById('purchase-btn')
    purchaseBtn.addEventListener('click', function () {
      const email = document.getElementById('email').value
      const amountSpentNow = parseFloat(document.getElementById('amount-spent').value)
      uploadPurchase(email, amountSpentNow)
      email.value = ''
      document.getElementById('amount-spent').value = ''
    })

  }

  // Stats
  if (document.getElementById('stats')) {

    displayClientCount(clients)
    displayDiscountsGotten(clients)
    displayDiscountsClaimed(clients)
    sentimentAnalysis(clients)
    displayAverageExpenditure(clients)
    displayTotalProfit(clients)

  }

  // Campaigns
  if(document.getElementById('campaigns')) {

    document.getElementById('campaign-btn').addEventListener('click', async (e) => {
      e.preventDefault()

      loader.style.display = "block"
    
      const title = document.getElementById('title').value
      const content = document.getElementById('content').value
      const imageFile = document.getElementById('image-upload').files[0]
    
      if (!title || !content) {
        alert('Please fill out the title and content.')
        loader.style.display = "none"
        return
      }
    
      let imageUrl = ''
    
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile)
      }
    
      try {
        await sendCampaignEmail(clients, title, content, imageUrl)
      } catch (error) {
        console.error('Error sending campaign emails:', error)
        alert('Error sending campaign emails. Please try again.')
      }

      loader.style.display = "none"

    })    

  }

  // Download
  if (document.getElementById('download')) {

    const pdfBtn = document.getElementById('pdf-btn') 
    pdfBtn.addEventListener('click', function () {
      downloadPDF(clients)
    })

    const csvBtn = document.getElementById('csv-btn') 
    csvBtn.addEventListener('click', function () {
      downloadCSV(clients)
    })

  }


})
