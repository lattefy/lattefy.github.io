// Lattefy | Authentication JavaScript File

/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DATABASE CONNECTION -------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// const apiUrl = 'http://localhost:3089'
const apiUrl = 'https://backend-5v26.onrender.com'

// Fetch all users
async function getAll() {
  try {
    const response = await fetch(`${apiUrl}/users`)
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

// Get user by email
function getUserByEmail(users, email) {
  return users.find(user => user.email === email)
}

// Function to Authenticate user
async function authenticateUser (users, email, password) {

  console.log(`USER AUTH: email: ${email}, password: ${password}`)

  // Authenticate email
  function authenticateEmail(users, email) {
    return users.some(user => user.email === email)
  }

  // Authenticate Password
  function authenticatePassword(users, email, password) {
    const user = users.find(user => user.email === email)
    return user && user.password === password
  }

  const user = await getUserByEmail(users, email)
  console.log(user)
  if (!authenticateEmail(users, email) || !authenticatePassword(users, email, password)) {
    console.log("Error authenticating user")
    return false
  }
  return true
}




// Log In

if (document.getElementById('login')) {

  async function login () {

    const users = await getAll()
    const email = document.getElementById('user-email').value
    const password = document.getElementById('user-password').value

    if (await authenticateUser(users, email, password)) {
      const user = getUserByEmail(users, email)
      
      if (user) {
        window.location.href = `${user.dashboardLink}?email=${user.email}&password=${user.password}`
      } else {
        console.error('User not found')
      }
    } else {
      console.error('Error authenticating user')
    }

  }

  loginBtn = document.getElementById('login-btn')
  loginBtn.addEventListener('click', login)

}


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
                   '<br/> Celular: ' + phoneNumber.value + '<br/> Motivo: ' + reason.value;

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


