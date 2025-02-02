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
        if (!response.ok) {
            throw new Error('Failed to fetch template')
        }
        const templateData = await response.json()
        console.log('Fetched template:', templateData)
        return templateData[0]
    } catch (error) {
        console.error(error)
        return null
    }
}

// Display client cards in a swipeable carousel
async function displayClientCards(cards, clientPhoneNumber) {

    const container = document.getElementById('cards-container')
    container.innerHTML = ''
    
    console.log('Fetching client for phoneNumber:', clientPhoneNumber)
    const client = await getClient(clientPhoneNumber)
    const clientName = client ? client.name : 'Cliente'
    
    // Create carousel wrapper
    const carouselWrapper = document.createElement('div')
    carouselWrapper.className = 'carousel-wrapper'
    carouselWrapper.style.width = '100%'
    carouselWrapper.style.justifyContent = 'left'


    const indicators = document.createElement('div')
    indicators.className = 'carousel-indicators'

    for (let index = 0; index < cards.length; index++) {
        const card = cards[index]
        console.log('Processing card:', card)
        const template = await getTemplate(card.templateId)
        if (!template) continue
        
        const imageUrl = template.imageUrl ? template.imageUrl : 'assets/images/brand/default-logo.png'

        const cardElement = document.createElement('div')
        cardElement.className = 'card-container carousel-item'
        cardElement.style.backgroundColor = template.bgColor || 'var(--card-bg-color)'
        cardElement.style.color = template.textColor || 'var(--card-text-color)'
        cardElement.style.width = '100%'
        cardElement.style.flexShrink = '0'

        let method 
        console.log(template.pointAddition)
        if (template.pointAddition === 'LINEAL') {
            method = 'cada'
        } else if (template.pointAddition === 'FIXED') {
            method = '= compra mayor a'
        } else {
            method = '='
        }

        cardElement.innerHTML = `
            <img src="${imageUrl}" alt="${template.name}" class="card-logo">

            <h5 class="card-header" style="color: ${template.headerColor || 'inherit'}">${template.header || 'FIDELITY CARD'}</h5>

            <h1 class="card-client-name" style="color: ${template.nameColor || 'inherit'}">${clientName}</h1>

            <div class="card-points" style="background-color: ${template.pointsBgColor || 'white'}; color: ${template.pointsTextColor || 'black'}">
                <h3>${card.currentPoints || 0} / ${template.pointsNeeded || 'N/A'}</h3>
                <span>${template.pointsName || 'Puntos'}</span>
            </div>

            <ul class="card-rewards">
                <li>
                    <div class="reward-box" style="background-color: ${template.rewardBgColor || 'white'}; color: ${template.rewardTextColor || 'black'}">
                        <p style="color: ${template.priceTextColor}">${template.pointsNeeded || 0} ${template.pointsName || 'Puntos'} =</p>
                        <p style="color: ${template.rewardTextColor}"><b>${template.reward || 'Recompensa'}</b></p>
                    </div>
                </li>
                <li class="card-footer" style="color: ${template.footerColor || 'inherit'}">${template.footer || 'Acumula puntos con tus compras'}</li>
                <li class="card-price" style"color: ${template.footerColor || 'inherit'}"><b>1 ${template.pointName} ${method} $ ${template.pointCost}</b></li>
            </ul>
        `

        carouselWrapper.appendChild(cardElement)
        
        const dot = document.createElement('span')
        dot.className = 'carousel-dot'
        dot.onclick = () => setActiveCard(index)
        indicators.appendChild(dot)
        console.log('Added card:', card)

    }
    
    const carouselContainer = document.createElement('div')
    carouselContainer.className = 'carousel-container'
    carouselContainer.appendChild(carouselWrapper)
    carouselContainer.appendChild(indicators)
    container.appendChild(carouselContainer)

    setActiveCard(0)

    loader.style.display = 'none'

}

function setActiveCard(index) {
    const wrapper = document.querySelector('.carousel-wrapper')
    const dots = document.querySelectorAll('.carousel-dot')
    if (!wrapper) return
    
    wrapper.style.transition = 'transform 0.3s ease-out'
    wrapper.style.transform = `translateX(${-index * 107}%)`
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
