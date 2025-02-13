// Lattefy's frontend dashboard main file

// Fetch all
async function getAll(database) {
    try {
      const response = await fetch(`${apiUrl}/${database}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('dbAccessToken')}`
          }
      }) 
      if (!response.ok) throw new Error('Network response was not ok')
      return await response.json()
  
    } catch (error) {
        console.error('Error fetching clients:', error)
        return []
    }
  
}

// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {

    // auth
    const accessToken = localStorage.getItem('dbAccessToken')
    const refreshToken = localStorage.getItem('dbRefreshToken')
    user = await authUser(accessToken, refreshToken)

    console.log(user)

    // clients
    const clients = await getAll('clients')
    console.log(clients)

    // cards
    const cards = await getAll('cards')
    console.log(cards)

    // business
    const business = await getBusinessById(user.businessId)

    // log-out
    const logOutBtn = document.getElementById('logout-btn')
    logOutBtn.addEventListener('click', function () {
        localStorage.removeItem('dbAccessToken')
        localStorage.removeItem('dbRefreshToken')
        window.location.href = './login.html'
    })

    // Reload
    const reloadBtn = document.querySelector(".reload")
    if (reloadBtn) {
        reloadBtn.addEventListener("click", function() {
            window.location.reload()
        })
    }

    // Wallet
    let urlTemplateId
    if (business.fidelityTemplateId) {
        urlTemplateId = business.fidelityTemplateId
    } else if (business.giftTemplateId) {
        urlTemplateId = business.giftTemplateId
    }

    const walletBtn = document.getElementById('wallet-btn')
    if (walletBtn) {
        walletBtn.addEventListener("click", function() {
            window.location.href = `https://lattefy.com.uy/wallet/signup.html?businessId=${user.businessId}&templateId=${urlTemplateId}`
        })
    }


    // Sidebar
    displaySidebarBtns(business, user.role)
        

    // Dashboard
    if (document.getElementById('dashboard')) {

        // Custom
        displayBusinessName(user)

        // Stats
        displayTotalClients(clients)
        displayTotalType(cards, business) // points || discount/reward
        displayTotalSpent(cards)
        displayAverageExpenditure(cards)

        // Table
        displayClientsDashboard(clients)

    }

    // Campaigns 
    if (document.getElementById('campaigns')) {
        const allowedRoles = ['admin', 'manager']
        await checkRole(user.role, allowedRoles)
    }

    // Points
    if (document.getElementById("points")) {
        console.log("Initializing Points Page")

        // Get button elements
        const purchaseBtn = document.getElementById("add-points-btn")
        const claimRewardBtn = document.getElementById("claim-reward-btn")
        const addPointBtn = document.getElementById("add-point")
        const subtractPointBtn = document.getElementById("subtract-point")

        // Get input elements
        const functionSelector = document.getElementById("function-selector")
        const amountSpentInput = document.getElementById("amount-spent")
        const suggestedPointsDisplay = document.getElementById("point-amount")
        const phoneInput = document.getElementById("phone-add")
        const phoneRewardInput = document.getElementById("phone-claim")

        window.userModifiedPoints = false // Global flag to track manual changes

        // Initialize UI logic
        handlePointsUI()

        // Listen for function type change (Add Points / Claim Reward)
        functionSelector.addEventListener("change", handlePointsUI)

        // Listen for amount input change (Update suggested points dynamically)
        amountSpentInput.addEventListener("input", async () => {
            const template = await getTemplateById(business.fidelityTemplateId)
            if (!template) return

            const amountSpent = parseFloat(amountSpentInput.value)

            // Reset user modification flag when amount is changed
            window.userModifiedPoints = false

            calculatePoints(template, amountSpent)
        })

        // Handle Point Adjustment Buttons
        addPointBtn.addEventListener("click", () => {
            let currentPoints = parseInt(suggestedPointsDisplay.textContent)
            suggestedPointsDisplay.textContent = currentPoints + 1
            window.userModifiedPoints = true // Mark as manually modified
        })

        subtractPointBtn.addEventListener("click", () => {
            let currentPoints = parseInt(suggestedPointsDisplay.textContent)
            if (currentPoints > 0) {
                suggestedPointsDisplay.textContent = currentPoints - 1
                window.userModifiedPoints = true // Mark as manually modified
            }
        })

        // Handle Adding Points
        purchaseBtn.addEventListener("click", async () => {
            const phoneNumber = phoneInput.value.trim()

            if (!phoneNumber) {
                alert("Por favor, ingresa un número de celular válido.")
                return
            }
            const amountSpent = parseFloat(amountSpentInput.value) || 0 
            

            const template = await getTemplateById(business.fidelityTemplateId)
            if (!template) {
                alert("No se encontró la plantilla de puntos.")
                return
            }

            // Get final points value (either suggested or manually updated)
            const pointsToAdd = parseInt(suggestedPointsDisplay.textContent)

            await addPoints(phoneNumber, business.businessId, template, amountSpent, pointsToAdd)

            phoneInput.value = ""
            amountSpentInput.value = ""
            suggestedPointsDisplay.textContent = "0"
            window.userModifiedPoints = false // Reset flag
        })

        // Handle Claiming Reward
        claimRewardBtn.addEventListener("click", async () => {
            const phoneNumber = phoneRewardInput.value.trim()
            if (!phoneNumber) {
                alert("Por favor, ingresa un número de celular.")
                return
            }

            const template = await getTemplateById(business.fidelityTemplateId)
            if (!template) {
                alert("Could not find template")
                return
            }

            await claimReward(phoneNumber, business.businessId, template)
            phoneRewardInput.value = ""
        })
    }

    // Loader
    const loader = document.getElementById("loader")
    if (loader) {
        loader.style.display = "none"
    }


})