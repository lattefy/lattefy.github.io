// Lattefy's frontend account page file:


async function displayClientData (client) {
    const clientName = document.getElementById('client-name')
    const clientPhone = document.getElementById('client-phone-number')
    const clientEmail = document.getElementById('client-email')

    clientName.innerText = client.name
    clientPhone.innerText = client.phoneNumber
    clientEmail.innerText = client.email
}

