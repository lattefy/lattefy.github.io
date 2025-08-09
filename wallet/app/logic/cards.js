// Lattefy's frontend wallet cards logic file:


// // Fetch client cards + template by phone number
// async function getClientCards(clientPhoneNumber) {
//     try {
//         const token = localStorage.getItem('accessToken')

//         const response = await fetch(`${apiUrl}/cards/with-templates/${clientPhoneNumber}`, {
//             method: 'GET',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         })

//         if (!response.ok) {
//             throw new Error('Failed to fetch client cards with templates')
//         }

//         const cards = await response.json()
//         console.log('Fetched client cards with templates:', cards)
//         return cards
//     } catch (error) {
//         console.error(error)
//         return []
//     }
// }

async function getClientCards(clientPhoneNumber) {
    try {
        const token = localStorage.getItem('accessToken')

        const response = await fetch(`${apiUrl}/cards/with-templates/${clientPhoneNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch cards + templates + client')
        }

        const result = await response.json()
        console.log('Fetched data:', result)

        return result // contains { clientName, cards }

    } catch (error) {
        console.error(error)
        return { clientName: 'Cliente', cards: [] }
    }
}


// // Display client cards 
// async function displayClientCards(cards, clientPhoneNumber) {
//     const container = document.getElementById('cards-container')
//     container.innerHTML = ''

//     console.log('Fetching client for phoneNumber:', clientPhoneNumber)
//     const client = await getClient(clientPhoneNumber)
//     const clientName = client ? client.name : 'Cliente'

//     const carouselWrapper = document.createElement('div')
//     carouselWrapper.className = 'carousel-wrapper'
//     carouselWrapper.style.width = '100%'
//     carouselWrapper.style.justifyContent = 'left'

//     const indicators = document.createElement('div')
//     indicators.className = 'carousel-indicators'

//     const carouselContainer = document.createElement('div')
//     carouselContainer.className = 'carousel-container'
//     carouselContainer.appendChild(carouselWrapper)
//     carouselContainer.appendChild(indicators)
//     container.appendChild(carouselContainer)

//     for (let index = 0 index < cards.length index++) {
//         const card = cards[index]
//         console.log('Processing card:', card)
        
//         const template = card.template
//         if (!template) {
//             console.warn(`Skipping card ${card.templateId}: Template not found`)
//             continue
//         }
//         // if (template.status !== 'ACTIVE') {
//         //     console.warn(`Skipping card ${card.templateId}: Template is ${template.status}`)
//         //     continue
//         // }
        
//         const cardImage = template.cardUrl ? template.cardUrl : 'assets/images/brand/default-logo.png'

//         const cardElement = document.createElement('div')
//         cardElement.className = 'card-container carousel-item'
//         cardElement.style.backgroundColor = template.bgColor || 'var(--card-bg-color)'
//         cardElement.style.color = template.textColor || 'var(--card-text-color)'
//         cardElement.style.width = '100%'
//         cardElement.style.flexShrink = '0'

//         // Determine which card type to render
//         switch (template.type) {
//             case 'FIDELITY':
//                 cardElement.innerHTML = fidelityCardHTML(card, clientName, template, cardImage)
//                 break
//             case 'GIFT':
//                 cardElement.innerHTML = giftCardHTML(card, clientName, template, cardImage)
//                 break
//             case 'DISCOUNT':
//                 cardElement.innerHTML = discountCardHTML(card, clientName, template, cardImage)
//                 break
//             default:
//                 cardElement.innerHTML = `<p>Unknown Card Type</p>`
//         }

//         carouselWrapper.appendChild(cardElement)
        
//         const dot = document.createElement('span')
//         dot.className = 'carousel-dot'
//         dot.onclick = () => setActiveCard(index)
//         indicators.appendChild(dot)
//         console.log('Added card:', card)

//         if (index === 0) {
//             loader.style.display = 'none'
//             setActiveCard(0)
//         }
//     }
    
// }

async function displayClientCards({cards, clientName}) {
    const container = document.getElementById('cards-container')
    container.innerHTML = ''

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
        const template = card.template
        if (!template) continue
        if (!template || template.status !== 'ACTIVE') continue
        if (card.status !== 'ACTIVE') continue

        const cardImage = template.cardUrl || 'assets/images/brand/default-logo.png'

        const cardElement = document.createElement('div')
        cardElement.className = 'card-container carousel-item'
        cardElement.style.backgroundColor = template.bgColor || 'var(--card-bg-color)'
        cardElement.style.color = template.textColor || 'var(--card-text-color)'
        cardElement.style.width = '100%'
        cardElement.style.flexShrink = '0'

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

        if (index === 0) {
            loader.style.display = 'none'
            setActiveCard(0)
        }

        cardElement.addEventListener('click', () => {
            displayExpandedCard(card, clientName)
        })

    }
    loader.style.display = 'none'

    if (carouselWrapper.children.length > 0) {
        setActiveCard(0)
    } else {
        console.log('No valid cards to display')
        const noCardsMessage = document.getElementById("no-cards-message")
        if (noCardsMessage) {
            noCardsMessage.classList.add("active")
        }
    }
}

// Card Dots
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
async function sortCards(cardsData, businessId, templateId) {
    try {
        const cards = cardsData.cards || []
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
        await displayClientCards(cardsData)
    } catch (error) {
        console.error("Failed to sort cards:", error)
    }
}



function displayExpandedCard(card, clientName) {
    const existing = document.getElementById('expanded-card')
    if (existing) existing.remove()
  
    const template = card.template
    const points = card.totalPoints ?? 0

    let pointName
    if (points == 1) {
        pointName = template.pointName ?? 'punto'
    } else {
        pointName = template.pointsName ?? 'puntos'
    }
  
    const overlay = document.createElement('div')
    overlay.id = 'expanded-card'
    overlay.className = 'expanded-card'

    switch (template.type) {
        case 'FIDELITY':
            overlay.innerHTML = expandedFidelityCard(template, clientName, pointName, points)
            break
        case 'GIFT':
            overlay.innerHTML = expandedGiftCard(template, clientName)
            break
        case 'DISCOUNT':
            overlay.innerHTML = expandedGiftCard(template, clientName)
            break
        default:
            overlay.innerHTML = '<p>Tipo de tarjeta desconocido</p>'
    }
  
    document.body.appendChild(overlay)


    const qrContainer = document.getElementById("wallet-qr")
    qrContainer.innerHTML = ""
  
    new QRCode(qrContainer, {
        text: card.clientPhoneNumber,
        width: 150,
        height: 150,
        colorDark: template.textColor,
        colorLight: template.bgColor,
        correctLevel: QRCode.CorrectLevel.H
    })
  
    document.querySelector('.wallet-done').onclick = () => {
      overlay.remove()
      document.body.style.overflow = ''
    }

    setupCardSharing(card, template)
    setupCardMenu(card)
  
    document.body.style.overflow = 'hidden'
  }



//   function setupCardMenu(card) {
//     const toggle = document.getElementById('menu-toggle')
//     const menu = document.getElementById('menu-options')
  
//     if (!toggle || !menu) return
  
//     toggle.addEventListener('click', (e) => {
//       e.stopPropagation()
//       menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
//     })
  
//     document.addEventListener('click', () => {
//       menu.style.display = 'none'
//     })
  
//     // Opciones del menú
//     // document.getElementById('card-details')?.addEventListener('click', () => {
//     //   alert('Detalles de la tarjeta:\n' + JSON.stringify(card, null, 2))
//     // })
  
//   }

function setupCardMenu(card) {
    const toggle = document.getElementById('menu-toggle')
    const menu = document.getElementById('menu-options')
    if (!toggle || !menu) return
  
    toggle.addEventListener('click', (e) => {
      e.stopPropagation()
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
    })
  
    document.addEventListener('click', () => {
      menu.style.display = 'none'
    })
  
    const template = card.template || {}
  
    // Hacer pedido (actionBtnUrl) – only if the item exists
    const actionBtn = document.getElementById('card-action-btn')
    if (actionBtn && template.actionBtnUrl) {
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        const url = template.actionBtnUrl
        window.open(url, '_blank')
        menu.style.display = 'none'
      })
    }
  
    // Instagram – only if the item exists
    const igBtn = document.getElementById('instagram-btn')
    if (igBtn && template.instagram) {
      igBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        let url = template.instagram
        if (!/^https?:\/\//i.test(url)) {
          const handle = url.replace(/^@/, '')
          url = `https://instagram.com/${handle}`
        }
        window.open(url, '_blank')
        menu.style.display = 'none'
      })
    }
  
    // NOTE: Share remains bound by setupCardSharing(card, template) elsewhere,
    // and still uses id="share-card-btn" (now inside the menu).
  }