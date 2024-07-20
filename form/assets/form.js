// FRONTEND | Form

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

// Create client
async function createClient(clientData) {
  try {
    const response = await fetch(`${apiUrl}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    })
    const data = await response.json()
    console.log('Client created:', data)
  } catch (error) {
    console.error('Error creating client:', error)
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

// Get expiration & emission date 
function calculateDate(days) {
  const today = new Date()
  const date = new Date(today)
  date.setDate(today.getDate() + days)
  return date
}

// DOM Content Load
document.addEventListener('DOMContentLoaded', function () {

  // Form 
  if (document.getElementById('form')) {

    // Get 5-Star Rating
    function getStarRating() {
      let userRating = null

      document.querySelectorAll('.star').forEach((star, index) => {
        star.addEventListener('click', () => {
          userRating = 5 - index
          console.log('User rating updated:', userRating)
        })
      })
      return () => userRating
    }
    const getUserRating = getStarRating()

    document.getElementById('btn').addEventListener('click', () => {
      const rating = getUserRating()
      if (rating !== null) {
        console.log('User rating on button click:', rating)
      } else {
        console.log('No rating selected')
      }
    })

    // Form Submission
    const btn = document.getElementById("btn")
    btn.addEventListener('click', async function (event) {
      event.preventDefault()

      // Fixed Data
      const name = document.getElementById("name").value
      const phoneNumber = document.getElementById("phoneNumber").value
      const email = document.getElementById("email").value
      const birthDate = document.getElementById("birthdate").value

      // Discount Data
      const discountAvailable = true
      const emissionDate = calculateDate(1)
      const expirationDate = calculateDate(30)
      const discountsGotten = 1
      const discountsClaimed = 0

      // Data Analysis
      const lastRating = getUserRating()
      let averageRating = lastRating / discountsGotten

      try {
        if (await authenticateEmail(email)) {
          const clientData = {
            name,
            phoneNumber,
            email,
            birthDate,
            lastRating,
            averageRating,
            discountAvailable,
            emissionDate,
            expirationDate,
            discountsGotten,
            discountsClaimed,
            totalSpent: 0,
            averageExpenditure: 0
          }
          await createClient(clientData)
          console.log('Client created successfully')
          window.location.href = 'done.html'
        } else {
          const existingClient = await getClientByEmail(email)
          if (existingClient) {
            averageRating = ((existingClient.averageRating + lastRating) / 2).toFixed(2)
            const updates = {
              lastRating,
              averageRating,
              discountAvailable,
              emissionDate,
              expirationDate,
              discountsGotten: existingClient.discountsGotten + 1
            }
            await updateClient(email, updates)
            console.log('Client updated successfully')
            window.location.href = 'done.html'
          }
        }
      } catch (error) {
        console.error('Error creating or updating client:', error)
      }
    })
  }
})
