// Lattefy's frontend card types file


// cardTemplates.js

function fidelityCardHTML(card, clientName, template, cardImage) {

    return `
        <img src="${cardImage}" alt="${template.name}" class="card-logo">
        <h5 class="card-header" style="color: ${template.headerColor || 'inherit'}">
            ${template.header || 'FIDELITY CARD'}
        </h5>
        <h1 class="card-client-name" style="color: ${template.nameColor || 'inherit'}">${clientName}</h1>
        <div class="card-rectangle" style="background-color: ${template.rectangleBgColor || 'white'}; color: ${template.rectangleColor || 'black'}">
            <h3>${card.currentPoints || 0} / ${template.pointsNeeded || 'N/A'}</h3>
            <span>${template.pointsName || 'Puntos'}</span>
        </div>
        <div class="reward-box" style="background-color: ${template.rewardBgColor || 'white'}; color: ${template.rewardColor || 'black'}">
            <p style="color: ${template.amountColor}">${template.pointsNeeded || 0} ${template.pointsName || 'Puntos'} =</p>
            <p style="color: ${template.rewardColor}"><b>${template.reward || 'Recompensa'}</b></p>
        </div>
        <p class="card-text" style="color: ${template.textColor || 'inherit'}">
            ${template.text || `Sumá ${template.pointsName} con tu nº de teléfono` || 'Sumá puntos con tu nº de teléfono'}
        </p>
        <p class="card-footer" style"color: ${template.footerColor || 'inherit'}">
            <b>${template.footer}</b>
        </p>
    `
}

function giftCardHTML(card, clientName, template, cardImage) {

    console.log(card.createdAt, template.expiryTime)
    const expirationDate = formatExpirationDate(card.createdAt, template.expiryTime)

    return `
        <h5 class="card-header" style="color: ${template.headerColor || 'inherit'}">
            ${template.header || 'GIFT CARD'}
        </h5>
        <h1 class="card-client-name" style="color: ${template.nameColor || 'inherit'}">${clientName}</h1>
        <div class="card-rectangle" style="background-color: ${template.rectangleBgColor || 'white'}; color: ${template.rectangleColor || 'black'}">
            <h3>${template.gift || 'NO DISPONIBLE'}</h3>
        </div>
        <p class="card-expiration" style="color: ${template.expirationColor || 'inherit'}">
            ${`VALIDO HASTA: ${expirationDate}` || ''}
        </p>
        <img src="${cardImage}" alt="${template.name}" class="card-logo">
        <p class="card-text" style"color: ${template.textColor || 'inherit'}">
            ${template.text}
        </p>
        <p class="card-footer" style="color: ${template.footerColor || 'inherit'}">
            ${template.footer || 'Disfruta tu regalo exclusivo'}
        </p>
    `
}

function discountCardHTML(card, clientName, template, cardImage) {
    return `
        <h5 class="card-header" style="color: ${template.headerColor || 'inherit'}">${template.header || 'DISCOUNT CARD'}</h5>
        <h1 class="card-client-name" style="color: ${template.nameColor || 'inherit'}">${clientName}</h1>
        <div class="card-rectangle"  style="background-color: ${template.pointsBgColor || 'white'}; color: ${template.pointsTextColor || 'black'}>
            <h3>${template.discount || '10%'} OFF</h3>
            <span>${template.condition || 'en tu próxima compra'}</span>
        </div>
        <img src="${cardImage}" alt="${template.name}" class="card-logo">
        <p class="card-text" style="color: ${template.textColor || 'inherit'}">
        <p class="card-footer" style="color: ${template.footerColor || 'inherit'}">
            ${template.footer || 'Disfruta tu descuento exclusivo'}
        </p>
    `
}



// EXPIRATION DATE

// Function to get expiration date as MongoDB timestamp
function getexpiryTimestamp(createdAt, expiryTime) {
    const createdDate = new Date(createdAt)
    return new Date(createdDate.getTime() + expiryTime * 24 * 60 * 60 * 1000) // Returns Date object
}

// Function to format expiration date as DD/MM/YY
function formatExpirationDate(createdAt, expiryTime) {
    const expirationDate = getexpiryTimestamp(createdAt, expiryTime)
    
    const day = String(expirationDate.getDate()).padStart(2, '0')
    const month = String(expirationDate.getMonth() + 1).padStart(2, '0') // Month is 0-based
    const year = String(expirationDate.getFullYear()).slice(-2) // Get last two digits of year

    return `${day}/${month}/${year}`
}


