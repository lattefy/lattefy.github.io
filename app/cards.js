// Lattefy's wallet card.js

// Fetch client cards by phone number
async function getClientCards(clientPhoneNumber) {
    try {
        const token = localStorage.getItem('accessToken')
        
        // Now fetch client cards using the phone number
        const response = await fetch(`${apiUrl}/cards/${clientPhoneNumber}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error('Failed to fetch client cards')
        }
        return await response.json()
    } catch (error) {
        console.error(error)
        return []
    }
}

// Fetch client details by phone number
async function getClient(clientPhoneNumber) {
    try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch(`${apiUrl}/clients/${clientPhoneNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            window.location.href = './login.html'
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            throw new Error('Failed to fetch client details')
        }
        return await response.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

// Fetch template by templateId
async function getTemplate(templateId) {
    try {
        console.log('Fetching template for templateId:', templateId)
        const token = localStorage.getItem('accessToken')
        const response = await fetch(`${apiUrl}/templates/${templateId}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.ok) {
            const templateData = await response.json()
            console.log('Fetched template:', templateData)
            return templateData[0]
        }
    } catch (error) {
        console.error(error)
        return null
    }
}


async function displayClientCards(cards, clientPhoneNumber) {
    const container = document.getElementById('cards-container')
    container.innerHTML = ''

    console.log('Fetching client for phoneNumber:', clientPhoneNumber)
    const client = await getClient(clientPhoneNumber)
    const clientName = client ? client.name : 'Cliente'

    const carouselWrapper = document.createElement('div')
    carouselWrapper.className = 'carousel-wrapper'
    carouselWrapper.style.width = '100%'
    carouselWrapper.style.justifyContent = 'left'

    const indicators = document.createElement('div')
    indicators.className = 'carousel-indicators'

    const carouselContainer = document.createElement('div')
    carouselContainer.className = 'carousel-container'
    carouselContainer.appendChild(carouselWrapper)
    carouselContainer.appendChild(indicators)
    container.appendChild(carouselContainer)

    for (let index = 0; index < cards.length; index++) {
        const card = cards[index]
        console.log('Processing card:', card)
        const template = await getTemplate(card.templateId)
       
        if (!template) {
            console.warn(`Skipping card ${card.templateId}: Template not found`)
            continue
        }
        if (template.status !== 'ACTIVE') {
            console.warn(`Skipping card ${card.templateId}: Template is ${template.status}`)
            continue
        }
        
        const cardImage = template.cardUrl ? template.cardUrl : 'assets/images/brand/default-logo.png'

        const cardElement = document.createElement('div')
        cardElement.className = 'card-container carousel-item'
        cardElement.style.backgroundColor = template.bgColor || 'var(--card-bg-color)'
        cardElement.style.color = template.textColor || 'var(--card-text-color)'
        cardElement.style.width = '100%'
        cardElement.style.flexShrink = '0'

        // Determine which card type to render
        switch (template.type) {
            case 'FIDELITY':
                cardElement.innerHTML = fidelityCardHTML(card, clientName, template, cardImage)
                break
            case 'GIFT':
                cardElement.innerHTML = giftCardHTML(card, clientName, template, cardImage)
                break
            case 'DISCOUNT':
                cardElement.innerHTML = discountCardHTML(card, clientName, template, cardImage)
                break
            default:
                cardElement.innerHTML = `<p>Unknown Card Type</p>`
        }

        carouselWrapper.appendChild(cardElement)
        
        const dot = document.createElement('span')
        dot.className = 'carousel-dot'
        dot.onclick = () => setActiveCard(index)
        indicators.appendChild(dot)
        console.log('Added card:', card)

        if (index === 0) {
            loader.style.display = 'none'
            setActiveCard(0)
        }
    }
    
    // const carouselContainer = document.createElement('div')
    // carouselContainer.className = 'carousel-container'
    // carouselContainer.appendChild(carouselWrapper)
    // carouselContainer.appendChild(indicators)
    // container.appendChild(carouselContainer)

    // setActiveCard(0)
    // loader.style.display = 'none'
}


function setActiveCard(index) {
    const wrapper = document.querySelector('.carousel-wrapper')
    const dots = document.querySelectorAll('.carousel-dot')
    if (!wrapper) return
    
    wrapper.style.transition = 'transform 0.3s ease-out'
    wrapper.style.transform = `translateX(${-index * 106.65}%)`
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index)
    })
}

// Ensure swiping only stops on full cards
let touchStartX = 0
let touchEndX = 0
let currentIndex = 0

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX
})

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX
    handleSwipe()
})

function handleSwipe() {
    const items = document.querySelectorAll('.carousel-item')
    if (!items.length) return
    
    if (touchEndX < touchStartX - 50) {
        currentIndex = Math.min(currentIndex + 1, items.length - 1)
    } else if (touchEndX > touchStartX + 50) {
        currentIndex = Math.max(currentIndex - 1, 0)
    }
    setActiveCard(currentIndex)
}


// Sort cards to bring the specified one to the front
async function sortCards(cards, businessId, templateId, clientPhoneNumber) {
    try {
        if (!Array.isArray(cards) || cards.length === 0) {
            console.error("No cards available to sort")
            return
        }

        // Ensure numbers are correctly compared
        const targetBusinessId = Number(businessId)
        const targetTemplateId = Number(templateId)

        console.log("Sorting cards for:", targetBusinessId, targetTemplateId)
        console.log("Current cards list:", cards)

        // Find the card with the specified businessId and templateId
        const targetCardIndex = cards.findIndex(card => 
            Number(card.businessId) === targetBusinessId && Number(card.templateId) === targetTemplateId
        )

        if (targetCardIndex !== -1) {
            console.log("Card found at index:", targetCardIndex)

            // Move the target card to the front
            const targetCard = cards.splice(targetCardIndex, 1)[0]
            cards.unshift(targetCard)

            console.log("Updated card order:", cards)
        } else {
            console.warn("No matching card found for sorting")
        }

        // Display the sorted cards
        await displayClientCards(cards, clientPhoneNumber)
    } catch (error) {
        console.error("Failed to sort cards:", error)
    }
}

