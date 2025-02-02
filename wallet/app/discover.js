// Lattefy Discover Page Logic

let selectedBusiness = null

function showPopup(businessName, businessId, templateId) {
    selectedBusiness = { businessId, templateId }
    
    console.log(`Popup for ${businessName}, Business ID: ${businessId}, Template ID: ${templateId}`) // Debugging log
    
    const popupMessage = document.getElementById("popup-message")
    popupMessage.textContent = `Add card for ${businessName}?`
    
    document.getElementById("add-card").classList.remove("hidden")
    document.getElementById("popup").classList.remove("hidden")
}

async function addCardToWallet() {
    if (!selectedBusiness) return
    const clientPhoneNumber = localStorage.getItem("clientPhoneNumber")
    
    try {
        const token = localStorage.getItem("accessToken")
        
        const response = await fetch(`${apiUrl}/cards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                clientPhoneNumber,
                businessId: selectedBusiness.businessId,
                templateId: selectedBusiness.templateId
            })
        })
        
        if (!response.ok) throw new Error("Failed to add card")
        
        document.getElementById("popup-message").textContent = "Card successfully added!"
        document.getElementById("add-card").classList.add("hidden")
    } catch (error) {
        console.error(error)
        document.getElementById("popup-message").textContent = "Error adding card. Please try again."
    }
}

function closePopup() {
    document.getElementById("popup").classList.add("hidden")
}

function initializeDiscoverPage() {
    console.log("Attaching event listeners to business boxes...") // Debugging log
    const businesses = [
        { name: "Billy Burgers", businessId: 1, templateId: 101 },
        { name: "Coffee Hub", businessId: 2, templateId: 102 },
        { name: "Fresh Mart", businessId: 3, templateId: 103 }
    ]

    document.querySelectorAll(".business-box").forEach((box, index) => {
        console.log(`Adding listener to: ${box.textContent.trim()}`) // Debugging log
        box.addEventListener("click", () => {
            const { name, businessId, templateId } = businesses[index]
            showPopup(name, businessId, templateId)
        })
    })
    
    document.getElementById("add-card").addEventListener("click", addCardToWallet)
    document.getElementById("cancel").addEventListener("click", closePopup)
}
