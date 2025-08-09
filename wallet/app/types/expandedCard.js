// Lattefy frontend wallet expandedCard types file:


function expandedFidelityCard (template, clientName, pointName, points) {
  return `
    <div class="wallet-expanded-header">
      <div class="wallet-header-done">
        <a class="wallet-done">Listo</a>
      </div>
      <div class="wallet-header-icons">
        <div class="dropdown">
          <i id="menu-toggle" class="ph ph-dots-three-circle"></i>
          <ul class="dropdown-menu" id="menu-options">
            ${
              template.actionBtnUrl
                ? `
                  <li id="card-action-btn" class="menu-link">
                    <span>Hacer pedido</span>
                    <i class="${template.actionBtnIcon || 'ph ph-bag-simple'}"></i>
                  </li>
                `
                : ''
            }
            ${
              template.instagram
                ? `
                  <li id="instagram-btn" class="menu-link">
                    <span>Instagram</span>
                    <i class="ph ph-instagram-logo"></i>
                  </li>
                `
                : ''
            }
            <li id="share-card-btn" class="menu-link">
              <span>Compartir</span>
              <i class="ph ph-export"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="wallet-card-expanded" style="background-color: ${template.bgColor || '#fff'}; color: ${template.rectangleBgColor || '#000'}">
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
        <div class="dropdown">
          <i id="menu-toggle" class="ph ph-dots-three-circle"></i>
          <ul class="dropdown-menu" id="menu-options">
            ${
              template.actionBtnUrl
                ? `
                  <li id="card-action-btn" class="menu-link">
                    <span>Hacer pedido</span>
                    <i class="${template.actionBtnIcon || 'ph ph-bag-simple'}"></i>
                  </li>
                `
                : ''
            }
            ${
              template.instagram
                ? `
                  <li id="instagram-btn" class="menu-link">
                    <span>Instagram</span>
                    <i class="ph ph-instagram-logo"></i>
                  </li>
                `
                : ''
            }
            <li id="share-card-btn" class="menu-link">
              <span>Compartir</span>
              <i class="ph ph-export"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="wallet-card-expanded" style="background-color: ${template.bgColor || '#fff'}; color: ${template.rectangleBgColor || '#000'}">
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
