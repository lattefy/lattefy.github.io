// Lattefy frontend wallet expandedCard types file:


function expandedFidelityCard (template, clientName, pointName, points) {
    return `
      <div class="wallet-expanded-header">
        <div class="wallet-header-done">
            <a class="wallet-done">Listo</a>
        </div>
        <div class="wallet-header-icons"> 
            <i id="share-card-btn" class="ph ph-export"></i>
            <div class="dropdown">
              <i id="menu-toggle" class="ph ph-dots-three-circle"></i>
                <ul class="dropdown-menu" id="menu-options">
                  <li id="card-action-btn">
                    <span>Hacer pedido</span>
                    <i class="${template.actionBtnIcon}"></i>
                  </li>
                </ul>
            </div>
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

function expandedGiftCard (template, clientName) {
    return `
      <div class="wallet-expanded-header">
        <div class="wallet-header-done">
            <a class="wallet-done">Listo</a>
        </div>
        <div class="wallet-header-icons"> 
            <i id="share-card-btn" class="ph ph-export"></i>
            <div class="dropdown">
              <i id="menu-toggle" class="ph ph-dots-three-circle"></i>
              <ul class="dropdown-menu" id="menu-options">
                <li id="card-details">Ver detalles</li>
                <li id="card-notifications">Notificaciones</li>
                <li id="remove-card" class="danger">Eliminar tarjeta</li>
              </ul>
            </div>
        </div>
      </div>
  
      <div class="wallet-card-expanded" style="background-color: ${template.bgColor || '#fff'}; color: ${template.textColor || '#000'}">
        <div class="wallet-card-header">
          <span class="wallet-header-text">${template.header}</span>
          <span class="wallet-gift">
            <strong>${template.gift}</strong>
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
