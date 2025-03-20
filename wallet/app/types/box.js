// Lattefy's frontend wallet templates types file

function generateTemplateHTML(template) {
    let templateImage = template.imgUrl ? template.imgUrl : "assets/images/brand/default-logo.png"

    switch (template.type) {
        case "FIDELITY":
            return fidelityTemplateHTML(template, templateImage)
        case "GIFT":
            return giftTemplateHTML(template, templateImage)
        case "DISCOUNT":
            return discountTemplateHTML(template, templateImage)
        default:
            return `<p>Unknown Template Type</p>`
    }
}


function fidelityTemplateHTML(template, imageUrl) {
    return `
        <div class="template-box" style="background-color: ${template.bgColor}" data-id="${template.templateId}" data-business="${template.businessId}">
            <h5 class="template-header">${template.header}</h5>
            <img src="${imageUrl}" alt="${template.name}" class="template-img">
            <div class="template-info">
                <img src="${template.logoUrl}" alt="${template.businessName}" class="template-logo">
                <div class="template-text">
                    <h3 class="template-business-name">${template.businessName}</h3>
                    <p id="card-name" style="display: none">${template.header}</p>
                    <p class="template-text">
                        ${template.pointsNeeded} ${template.pointsName} = ${template.reward}
                    </p>
                    <p class="template-text">
                        ${template.footer}
                    </p>
                </div>
                <a href="#" class="template-rating">
                    <i class="ph ph-star"></i>
                    <p><b>${template.rating}</b></p>
                </a>
            </div>
        </div> 
    `
}

function giftTemplateHTML(template, imageUrl) {
    return `
        <div class="template-box" style="background-color: ${template.bgColor}" data-id="${template.templateId}" data-business="${template.businessId}">
            <h5 class="template-header">${template.header}</h5>
            <img src="${imageUrl}" alt="${template.name}" class="template-img">
            <div class="template-info">
                <img src="${template.logoUrl}" alt="${template.businessName}" class="template-logo">
                <div class="template-text">
                    <h3 class="template-business-name">${template.businessName}</h3>
                    <p id="card-name" style="display: none">${template.header}</p>
                    <p class="template-text">
                        ${template.gift}
                    </p>
                </div>
                <div class="template-rating">
                    <i class="ph ph-star"></i>
                    <p><b>${template.rating}</b></p>
                </div>
            </div>
        </div> 
    `
}

function discountTemplateHTML(template, imageUrl) {
    return `
        <div class="template-box" style="background-color: ${template.bgColor}" data-id="${template.templateId}" data-business="${template.businessId}">
            <h5 class="template-header">${template.header}</h5>
            <img src="${imageUrl}" alt="${template.name}" class="template-img">
            <div class="template-info">
                <img src="${template.logoUrl}" alt="${template.businessName}" class="template-logo">
                <div class="template-text">
                    <h3 class="template-business-name">${template.businessName}</h3>
                    <p id="card-name" style="display: none">${template.header}</p>
                    <p class="template-text">
                        ${template.discount} % OFF
                    </p>
                </div>
                <div class="template-rating">
                    <i class="ph ph-star"></i>
                    <p><b>${template.rating}</b></p>
                </div>
            </div>
        </div> 
    `
}
