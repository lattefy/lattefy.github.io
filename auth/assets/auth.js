// Lattefy | Authentication JavaScript File

/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DATABASE CONNECTION -------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// const apiUrl = 'http://localhost:3089'
const apiUrl = 'https://backend-v1-2-63a1.onrender.com'

// assets/auth.js

document.getElementById('login-btn').addEventListener('click', async () => {
const email = document.getElementById('user-email').value
const password = document.getElementById('user-password').value

// Validate input
if (!email || !password) {
    alert('Please enter both email and password')
    return
}

const loader = document.getElementById('loader')
loader.style.display = 'block' // Show loader while processing

try {
    // Send login request to the server
    const response = await fetch(`${apiUrl}/auth/login`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
        const errorMessage = await response.json()
        throw new Error(errorMessage) // Handle unauthorized responses
    }

    const data = await response.json()
    
    // Store tokens in localStorage or sessionStorage
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)

    // Fetch user by email with token protection
    const userResponse = await fetch(`${apiUrl}/users/${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })

    if (!userResponse.ok) {
        const errorMessage = await userResponse.json() 
        throw new Error(errorMessage) 
    }

    // Parse the user data
    const user = await userResponse.json()
    console.log(user) 

    window.location.href = `${user.dashboardLink}?email=${email}&password=${password}`

} catch (error) {
    alert('Login failed: ' + error.message)
} finally {
    loader.style.display = 'none' // Hide loader after processing
}
})


// Sign Up Email

if (document.getElementById('signup')) {

    const signupBtn = document.getElementById('signup-btn')

    signupBtn.addEventListener('click', function(e){
        e.preventDefault()

        const username = document.getElementById('name')
        const email = document.getElementById('email')
        const phoneNumber = document.getElementById('phone-number')
        const business = document.getElementById('business')
        const role = document.getElementById('role')
        const reason = document.getElementById('reason')

        function clearInputs(){
            username.value = ""
            email.value = ""
            phoneNumber.value = ""
            business.value = ""
            role.value = ""
            reason.value = ""
        }

        const body = '<br/> Nombre: ' + username.value + '<br/> Empresa: ' + business.value + 
                '<br/> Email: ' + email.value + '<br/> Cargo: ' + role.value +
                '<br/> Celular: ' + phoneNumber.value + '<br/> Motivo: ' + reason.value

        console.log(body)
        
        Email.send({
            SecureToken : "30d7ca7d-d42b-4b38-a8cd-e6fb6521274d",
            To : 'lattefy.ai@gmail.com',
            From : "lattefy.ai@gmail.com",
            Subject : "Signup | Form Submitted",
            Body : body
        }).then(
            message => {
                alert(message)
                clearInputs()
            }
        )

    })

}


