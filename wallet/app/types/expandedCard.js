// Lattefy frontend wallet expandedCard types file:


function expandedCard (template, clientName, pointName, points) {
    return `
      <div class="wallet-expanded-header">
        <button class="wallet-done">Listo</button>
        <div class="wallet-header-icons"> 
            <i id="share-card-btn" class="ph ph-export"></i>
            <!-- <i class="ph ph-dots-three-circle"></i> -->
        </div>
      </div>
  
      <div class="wallet-card-expanded" style="background-color: ${template.bgColor || '#fff'}; color: ${template.textColor || '#000'}">
        <div class="wallet-card-header">
          <span class="wallet-header-text">${template.header}</span>
          <span class="wallet-points">
            <strong>${points}</strong> ${pointName}
          </span>
        </div>
  
        <div class="wallet-card-image">
          <img src="${template.imgUrl}" alt="Card image" />
        </div>
  
        <div class="wallet-card-name">
          <span class="wallet-name-label">Titular</span>
          <span class="wallet-name-value">${clientName}</span>
        </div>

        <div class="wallet-qr-container" style="background-color: ${template.bgColor || '#fff'}">
          <div id="wallet-qr"></div>
        </div>
  
        <div class="wallet-card-footer">
          <p class="wallet-description">${template.text}</p>
          <p class="wallet-footer-text">${template.footer}</p>
        </div>
  
      </div>
    `
}
