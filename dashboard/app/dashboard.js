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

    console.log('User: ', user)

    // clients
    const clients = await getAll('clients')
    console.log('Clients: ', clients)

    // cards
    const cards = await getAll('cards')
    console.log('Cards: ', cards)

    // business
    const business = await getBusinessById(user.businessId)
    console.log('Business: ', business)

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

    // Template 
    let templateId = null
    let template = null
    if (business.templateIds.length >= 1) {
        templateId = business.templateIds[0] 
        template = await getTemplateById(templateId)
    }

    // Specific templates
    let fidelityTemplateId = null
    let giftTemplateId = null
    let discountTemplateId = null

    if (business.templateIds && Array.isArray(business.templateIds)) {
        business.templateIds.forEach(templateId => {
            const firstDigit = templateId.toString().charAt(0)

            if (firstDigit === "1") {
                fidelityTemplateId = templateId
            } else if (firstDigit === "2") {
                giftTemplateId = templateId
            } else if (firstDigit === "3") {
                discountTemplateId = templateId
            }
        })
    }

    // Sign up client
    const walletBtn = document.getElementById('wallet-btn')
    if (walletBtn && templateId) {
        walletBtn.addEventListener("click", function() {
            window.location.href = `https://lattefy.com.uy/wallet/signup.html?b=${user.businessId}&t=${templateId}`
        })
    } else if (walletBtn) {
        walletBtn.addEventListener("click", function() {
            window.location.href = `https://lattefy.com.uy/wallet/signup.html`
        })
    }


    // Sidebar
    displaySidebarBtns(business, user.role)
        
    // Dashboard
    if (document.getElementById('dashboard')) {

        // Handle role
        const allowedRoles = ['admin', 'manager']
        await checkRole(user.role, allowedRoles)

        // Custom
        displayBusinessName(user)

        // Stats
        displayTotalClients(clients)
        displayTotalType(cards, business, fidelityTemplateId, giftTemplateId, discountTemplateId) // points || discount/reward
        displayTotalSpent(cards)
        displayAverageExpenditure(cards)

        // Table
        displayClientsTable(clients)

    }

    // Campaigns 
    if (document.getElementById('campaigns')) {

        // Handle role
        const allowedRoles = ['admin', 'manager']
        await checkRole(user.role, allowedRoles)

        const fileInput = document.getElementById('image-upload')
        const fileName = document.getElementById('file-name')
    
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0]
            if (file) {
                fileName.textContent = file.name
            } else {
                fileName.textContent = '' 
            }
        })

        let audience = clients
        displayAudienceSize(audience)

        // Apply clients filter
        document.getElementById('apply-btn').addEventListener('click', async () => {
            const variable = document.getElementById('filter-variable').value
            const condition = document.getElementById('filter-condition').value
            const value = document.getElementById('filter-value').value.trim()

            if (!variable || !value) {
                alert('Por favor ingrese valores válidos para filtrar')
                return
            }

            // Wait for the filtered clients
            audience = await filterClients(clients, variable, condition, value)
            displayAudienceSize(audience)
            console.log('Audience:', audience)
        })

        // Reset clients filter
        document.getElementById('reset-btn').addEventListener('click', () => {
            audience = clients
            document.getElementById('filter-variable').selectedIndex = 0
            document.getElementById('filter-condition').selectedIndex = 0
            document.getElementById('filter-value').value = ''
            displayAudienceSize(clients)
            console.log('filters reset')
        })

        // Send emails
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
              imageUrl = await uploadImageToCloudinary(imageFile, `emails/campaigns/${business.domain}`)
            }
          
            try {
              await sendCampaignEmail(audience, templateId, title, content, imageUrl)
            } catch (error) {
              console.error('Error sending campaign emails:', error)
              alert('Error sending campaign emails. Please try again.')
            }
      
            loader.style.display = "none"
      
          }) 

    }

    // Clients
    if (document.getElementById('clients')) {
        
    }

    // Points
    if (document.getElementById("points")) {
        console.log("Initializing Points Page")

        // Template (points page)
        let fidelityTemplate = null
        console.log("Checking Fidelity Template ID:", fidelityTemplateId)

        if (fidelityTemplateId) {
            fidelityTemplate = await getTemplateById(fidelityTemplateId)
        } else {
            console.error("Required fidelity template is missing. Redirecting...")
            alert("No se encontró la plantilla de fidelidad.") 
            window.location.href = './index.html'
        }

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
            if (fidelityTemplate) {
                const amountSpent = parseFloat(amountSpentInput.value) || 0
                window.userModifiedPoints = false
                calculatePoints(fidelityTemplate, amountSpent)
            } else {
                console.log('No fidelity template found')
                return
            }
 
        
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

            // Get final points value (either suggested or manually updated)
            const pointsToAdd = parseInt(suggestedPointsDisplay.textContent) || 0

            await addPoints(phoneNumber, business.businessId, fidelityTemplate, amountSpent, pointsToAdd)

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

            if (fidelityTemplate) {
                await claimReward(phoneNumber, business.businessId, fidelityTemplate)
                phoneRewardInput.value = ""
            } else {
                console.log('No fidelity template found')
                return
            }
            
        })
    }

    // Gifts Page
    if (document.getElementById('gift')) {

        // Template (gifts page)
        let giftTemplate = null
        console.log("Checking Gift Template ID:", giftTemplateId)

        if (giftTemplateId) {
            giftTemplate = await getTemplateById(giftTemplateId)
        } else {
            console.error("Required gift template is missing. Redirecting...")
            alert("No se encontró la plantilla de regalos.") 
            window.location.href = './index.html'
        }

        // Inputs
        const getGiftBtn = document.getElementById("claim-reward-btn")
        const phoneInput = document.getElementById("phone-add")

        // Handle getting a Gift
        getGiftBtn.addEventListener("click", async () => {
            const phoneNumber = phoneInput.value.trim()
            if (!phoneNumber) {
                alert("Por favor, ingresa un número de celular.")
                return
            }

            if (giftTemplate) {
                await claimReward(phoneNumber, business.businessId, giftTemplate)
                phoneInput.value = ""
            } else {
                console.log('No gift template found')
                alert("No se encontró la plantilla de regalo.")
                return
            }
            
        })
    }

    // Loader
    const loader = document.getElementById("loader")
    if (loader) {
        loader.style.display = "none"
    }


})