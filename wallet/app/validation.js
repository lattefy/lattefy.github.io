// Lattefy's validation script

// Function to validate inputs
function validateInputs(name, email, phoneNumber, password) {
    let isValid = true
  
    // Name validation (basic check: not empty)
    const nameInput = document.getElementById('name')
    const nameLabel = document.getElementById('name-label')
    if (!name.trim()) {
        nameInput.style.borderColor = 'red'
        nameLabel.textContent = 'Nombre completo - Este campo es obligatorio'
        isValid = false
    } else {
        nameInput.style.borderColor = ''
        nameLabel.textContent = 'Nombre completo'
    }
  
    // Email validation
    const emailInput = document.getElementById('email')
    const emailLabel = document.getElementById('email-label')
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
        emailInput.style.borderColor = 'red'
        emailLabel.textContent = 'Email - Por favor ingrese un email válido'
        isValid = false
    } else {
        emailInput.style.borderColor = ''
        emailLabel.textContent = 'Email'
    }
  
    // Phone number validation
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber)
    if (!isPhoneNumberValid) {
      isValid = false
    }

    // Password validation
    const isPasswordValid = validatePassword(password)
    if (!isPasswordValid) {
        isValid = false
    }
  
    return isValid
  }
  
function validatePhoneNumber (phoneNumber) {

    let valid = true

    const phoneInput = document.getElementById('phone-number')
    const phoneLabel = document.getElementById('phone-number-label')
    const phonePattern = /^09\d{7}$/ // starts with 09 and is 9 digits
    if (!phonePattern.test(phoneNumber)) {
        phoneInput.style.borderColor = 'red'
        phoneLabel.textContent = 'Debe comenzar con 09 y tener 9 dígitos'
        valid = false
    } else {
        phoneInput.style.borderColor = ''
        phoneLabel.textContent = 'Celular'
    }

    return valid

}

function validatePassword(password) {
    let valid = true;

    const passwordInput = document.getElementById('password');
    const passwordLabel = document.getElementById('password-label');

    // At least 8 characters
    if (password.length < 8) {
        passwordInput.style.borderColor = 'red';
        passwordLabel.textContent = 'Debe tener al menos 8 caracteres';
        valid = false;
    }
    // At least one number
    else if (!/\d/.test(password)) {
        passwordInput.style.borderColor = 'red';
        passwordLabel.textContent = 'Debe contener números';
        valid = false;
    }
    // At least one uppercase letter
    else if (!/[A-Z]/.test(password)) {
        passwordInput.style.borderColor = 'red';
        passwordLabel.textContent = 'Debe contener letras mayúsculas';
        valid = false;
    }
    // Password is valid
    else {
        passwordInput.style.borderColor = '';
        passwordLabel.textContent = 'Contraseña';
    }

    return valid;
}
