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
async function authenticateEmail(email) {
  const clients = await getAll()
  return !clients.some(client => client.email === email)
}

// Get client by email
async function getClientByEmail(email) {
  try {
    const response = await fetch(`${apiUrl}/clients`)
    if (!response.ok) throw new Error('Network response was not ok')
    const clients = await response.json()
    return clients.find(client => client.email === email)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return null
  }
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
async function displayClientCount() {
  const clients = await getAll()
  const clientAmount = document.getElementById('client-amount')
  clientAmount.textContent = clients.length 
}

// Display discounts gotten
async function displayDiscountsGotten() {
  const clients = await getAll()
  const allDiscountsGotten = clients.map(client => client.discountsGotten)

  let discountGottenSum = 0
  for (let i = 0; i < allDiscountsGotten.length; i++) {
    discountGottenSum += allDiscountsGotten[i]
  }

  const discountsGottenOutput = document.getElementById('discounts-gotten')
  discountsGottenOutput.textContent = discountGottenSum

} 

// Display discounts claimed
async function displayDiscountsClaimed() {
  const clients = await getAll()
  const allDiscountsClaimed = clients.map(client => client.discountsClaimed)

  let discountsClaimedSum = 0
  for (let i = 0; i < allDiscountsClaimed.length; i++) {
    discountsClaimedSum += allDiscountsClaimed[i]
  }

  const discountsClaimedOutput = document.getElementById('discounts-claimed')
  discountsClaimedOutput.textContent = discountsClaimedSum

} 

// Calculate Overall Average Rating
async function sentimentAnalysis () {

  const clients = await getAll()
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
async function displayAverageExpenditure () {

  const clients = await getAll()
  const allExpenditures = clients.map(client => client.averageExpenditure)

  let expenditureSum = 0

  for (let i = 0; i < allExpenditures.length; i++) {
    expenditureSum += allExpenditures[i]
  }

  const overallExpenditure = expenditureSum / clients.length
  
  const expenditureOutput = document.getElementById('average-expenditure')
  expenditureOutput.textContent = "$" + overallExpenditure.toFixed(2)

}

// Display Total Profit
async function displayTotalProfit () {

  const clients = await getAll()
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
async function displayClients() {
  const clients = await getAll()
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
  const client = await getClientByEmail(email)
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

    updates = {}

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

        updates.discountsClaimed = discountsClaimed,
        updates.totalSpent = totalExpenditure,
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
/* ---------------------------------------- LOAD FUNCTIONS ----------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/


// DOM Content Load
document.addEventListener('DOMContentLoaded', function () {

  // Dashboard
  if (document.getElementById('dashboard')) {
    displayClientCount()
    displayDiscountsGotten()
    displayDiscountsClaimed()
    sentimentAnalysis()
    displayAverageExpenditure()
    displayTotalProfit()
  }

  // Clients
  if (document.getElementById('clients')) {
    displayClients()
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

})
