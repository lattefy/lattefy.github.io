// Lattefy's frontend discover script

// Get all templates
async function fetchTemplates() {
    const templatesContainer = document.getElementById("templates-container")

    try {
        const response = await fetch(`${apiUrl}/templates`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        if (!response.ok) throw new Error("Error fetching templates")

        const templates = await response.json()

        if (templates.length === 0) {
            templatesContainer.innerHTML = `<p class="no-templates">No hay tarjetas disponibles.</p>`
            return
        }

        templatesContainer.innerHTML = templates.map(template => `
            <div class="template-box" style="background-color: ${template.bgColor}" data-id="${template.templateId}" data-business="${template.businessId}">
                <h3>${template.businessName}</h3>
                <p>${template.reward || template.promotion || template.gift || "Recompensa no disponible"}</p>
                <p>${template.pointsNeeded ? `${template.pointsNeeded} ${template.pointsName}` : "Sin costo de puntos"}</p>
                <p>${template.pointCost ? `1 ${template.pointName} = $${template.pointCost}` : "Sin costo de puntos"}</p>
            </div>
        `).join("")
        
        document.querySelectorAll(".template-box").forEach(box => {
            box.addEventListener("click", function () {
                openPopup({
                    templateId: box.getAttribute("data-id"),
                    businessId: box.getAttribute("data-business"),
                    businessName: box.querySelector("h3").innerText
                })
            })
        })

    } catch (error) {
        console.error("Error loading templates:", error)
    }
}

// Functio to open pop up
function openPopup(template) {
    const popup = document.getElementById("popup")
    const popupOverlay = document.getElementById("popup-overlay")
    const popupBusinessName = document.getElementById("popup-template-hezder")

    selectedTemplate = template
    popupBusinessName.innerText = `Negocio: ${template.businessName}`
    popup.classList.add("active")
    popupOverlay.classList.add("active")
}


// Function to close pop up
function closePopup() {
    document.getElementById("popup").classList.remove("active")
    document.getElementById("popup-overlay").classList.remove("active")
}

// Function to add a card
async function addCard() {
    if (!selectedTemplate) return

    try {
        const clientData = await authClient(localStorage.getItem("accessToken"), localStorage.getItem("refreshToken"))

        const response = await fetch(`${apiUrl}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                clientPhoneNumber: clientData.phoneNumber,
                businessId: selectedTemplate.businessId,
                templateId: selectedTemplate.templateId
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            if (errorData.message === "Card already exists") {
                return showConfirmationMessage("Ya tienes esta tarjeta")
            } else {
                return showConfirmationMessage("Error al agregar tarjeta")
            }
        }

        // Add the business ID to the client
        await fetch(`${apiUrl}/clients/${clientData.phoneNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                newBusinessId: selectedTemplate.businessId
            })
        })

        showConfirmationMessage("Tarjeta agregada con éxito", true) // Pass true to trigger redirect

    } catch (error) {
        console.error("Error adding card:", error)
        showConfirmationMessage("Error en la solicitud")
    }
}

// Function to show confirmation message
function showConfirmationMessage(message, redirect = false) {
    const confirmation = document.getElementById("confirmation")
    confirmation.querySelector("h2").textContent = message

    document.getElementById("popup").classList.remove("active") // Hide popup
    confirmation.classList.add("active")

    // Keep blur and remove confirmation after 2 seconds
    setTimeout(() => {
        confirmation.classList.remove("active")
        document.getElementById("popup-overlay").classList.remove("active") // Remove blur

        // Redirect only after the message has been displayed
        if (redirect) {
            window.location.href = './index.html'
        }

    }, 2000)
}





