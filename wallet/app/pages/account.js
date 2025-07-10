// Lattefy's frontend account page file:


async function displayClientData(client) {
    const section = document.getElementById('profile-container')

    section.innerHTML = `
        <div class="profile">
            <div class="header">
                <i class="ph ph-user-circle"></i>
                <div class="profile-info">
                    <h3 id="client-name">${client.name || 'Nombre de Usuario'}</h3>
                    <h6 id="client-account-type">Fidelity Wallet</h6>
                </div>
            </div>
            <ul class="account-info">
                <li>
                    <i class="ph ph-envelope-simple"></i>
                    <p id="client-email">${client.email}</p>
                </li>
                <li>
                    <i class="ph ph-phone"></i>
                    <p id="client-phone-number">${client.phoneNumber}</p>
                </li>
            </ul>
        </div>
        <a class="btn" id="logout-btn">
            <i class="ph ph-sign-out"></i>
            <p>Cerrar Sesión</p>
        </a>
    `

    // Add logout listener after injecting
    document.getElementById('logout-btn').addEventListener('click', async () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = './login.html'
    })
}