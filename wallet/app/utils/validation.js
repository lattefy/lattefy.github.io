// Lattefy's frontend wallet validation utils file:


// Function to validate inputs
function validateInputs(name, phoneNumber, email, password) {
    let isValid = true

    if (!validateName(name)) isValid = false
    if (!validatePhoneNumber(phoneNumber)) isValid = false
    if (!validateEmail(email)) isValid = false
    if (!validatePassword(password)) isValid = false

    return isValid
}

// Validate Name
function validateName(name) {
    const nameInput = document.getElementById('name')
    const nameLabel = document.getElementById('name-label')

    if (name.trim().length === 0) {
        nameInput.style.borderColor = 'red'
        nameLabel.textContent = 'Nombre - Por favor ingrese su nombre'
        return false
    } else {
        nameInput.style.borderColor = ''
        nameLabel.textContent = 'Nombre'
        return true
    }
}

// Validate Phone Number
function validatePhoneNumber(phoneNumber) {
    const phoneInput = document.getElementById('phone-number') // Fixed incorrect ID
    const phoneLabel = document.getElementById('phone-number-label')
    const phonePattern = /^09\d{7}$/ // Must start with "09" and be 9 digits long

    if (!phonePattern.test(phoneNumber)) {
        phoneInput.style.borderColor = 'red'
        phoneLabel.textContent = 'Debe comenzar con 09 y tener 9 dígitos'
        return false
    } else {
        phoneInput.style.borderColor = ''
        phoneLabel.textContent = 'Celular'
        return true
    }
}

// Validate Email
function validateEmail(email) {
    const emailInput = document.getElementById('email')
    const emailLabel = document.getElementById('email-label')
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation

    if (!emailPattern.test(email)) {
        emailInput.style.borderColor = 'red'
        emailLabel.textContent = 'Email - Por favor ingrese un email válido'
        return false
    } else {
        emailInput.style.borderColor = ''
        emailLabel.textContent = 'Email'
        return true
    }
}

// Validate Password
function validatePassword(password) {
    const passwordInput = document.getElementById('password')
    const passwordLabel = document.getElementById('password-label')

    if (password.length < 8) {
        passwordInput.style.borderColor = 'red'
        passwordLabel.textContent = 'Debe tener al menos 8 caracteres'
        return false
    } else if (!/\d/.test(password)) {
        passwordInput.style.borderColor = 'red'
        passwordLabel.textContent = 'Debe contener números'
        return false
    } else if (!/[A-Z]/.test(password)) {
        passwordInput.style.borderColor = 'red'
        passwordLabel.textContent = 'Debe contener letras mayúsculas'
        return false
    } else {
        passwordInput.style.borderColor = ''
        passwordLabel.textContent = 'Contraseña'
        return true
    }
}
