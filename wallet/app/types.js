// Lattefy's frontend types file

// cardTemplates.js

function fidelityCardHTML(card, clientName, template, cardImage) {

    let method
    if (template.pointAddition === 'LINEAR') {
        method = 'cada'
    } else if ( template.pointAddition === 'FIXED') {
        method = '= compra mayor a' 
    } else {
        method = '='
    }

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
            <b>${template.footer} || +1 ${template.pointName} ${method} $ ${template.pointCost}</b>
        </p>
    `
}

function giftCardHTML(card, clientName, template, cardImage) {
    return `
        <img src="${cardImage}" alt="${template.name}" class="card-logo">
        <h5 class="card-header" style="color: ${template.headerColor || 'inherit'}">${template.header || 'GIFT CARD'}</h5>
        <h1 class="card-client-name" style="color: ${template.nameColor || 'inherit'}">${clientName}</h1>
        <div class="card-balance">
            <h3>${card.balance || 0} ${template.currency || 'USD'}</h3>
            <span>${template.balanceLabel || 'Balance'}</span>
        </div>
        <p class="card-footer" style="color: ${template.footerColor || 'inherit'}">
            ${template.footer || 'Usa esta tarjeta para tus compras'}
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

