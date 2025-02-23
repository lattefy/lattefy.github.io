// Lattefy's frontend discover script

setupSearch("search-bar", "template-box", "template-business-name")

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
                <img src="${template.imgUrl}" alt="${template.name}" class="template-img">
                <div class="template-info">
                    <img src="${template.logoUrl}" alt="${template.businessName}" class="template-logo">
                    <div class="template-text">
                        <h3 class="template-business-name">${template.businessName}</h3>
                        <p class="template-text">
                            ${template.pointsNeeded} ${template.pointsName} = ${template.reward}
                        </p>
                    </div>
                    <div class="template-rating">
                        <i class="ph ph-star"></i>
                        <p><b>${template.rating}</b></p>
                    </div>
                </div>
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

// Function to add a card and redirect to wallet with confirmation message
async function addCard() {
    if (!selectedTemplate) return

    const addCardBtn = document.getElementById("add-card-btn")
    const addCardLoader = document.getElementById("btn-loader")

    try {

        // Loader
        if (addCardBtn && addCardLoader) {
            addCardBtn.classList.add("loading")
            addCardLoader.classList.remove("hidden")
            addCardBtn.textContent = ""
            addCardBtn.prepend(addCardLoader) 
        }

        const clientData = await authClient(localStorage.getItem("accessToken"), localStorage.getItem("refreshToken"))

        // Store sessionStorage before API calls to avoid data loss
        sessionStorage.setItem('cardBusinessId', selectedTemplate.businessId)
        sessionStorage.setItem('cardTemplateId', selectedTemplate.templateId)

        let cardExists = false

        // Attempt to create the card
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
                console.log("Ya tienes esta tarjeta")
                cardExists = true
                showConfirmationMessage("Ya tienes esta tarjeta") // Show pop-up confirmation
            } else {
                return showConfirmationMessage("Error al agregar tarjeta") // Exit on error
            }
        } else {
            await sendBusinessEmail(clientData.phoneNumber, selectedTemplate.templateId, 'card') // Send email
            showConfirmationMessage("Tarjeta agregada con éxito") // Show success message
        }

        // Only update the business ID if the card was newly added
        if (!cardExists) {
            const updateClientResponse = await fetch(`${apiUrl}/clients/${clientData.phoneNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    newBusinessId: selectedTemplate.businessId
                })
            })

            if (!updateClientResponse.ok) {
                console.error("Error updating client with new business ID")
            }
        }

        console.log("Tarjeta agregada con éxito")

        // Redirect to wallet (index.html) after a short delay to show the confirmation
        setTimeout(() => {
            window.location.href = './index.html'
        }, 2000) // 2-second delay to let the confirmation message appear

    } catch (error) {
        console.error("Error adding card:", error)
        showConfirmationMessage("Error en la solicitud")

    } finally {
        // Hide loader and enable button
        addCardBtn.classList.remove("loading")
        addCardLoader.classList.add("hidden")
        addCardBtn.textContent = "Agregar tarjeta"
    }
}



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





