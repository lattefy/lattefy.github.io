/* --------------------------------------------------------------------------------------------------*/
/* ------------------------------------------ USER AUTH -------------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

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

  if (!authenticateEmail(users, email) || !authenticatePassword(users, email, password)) {
    console.log("Error authenticating user")
    return false
  }
  return true
}

// Get email from URL
function getEmailFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  console.log(urlParams.get('email'))
  return urlParams.get('email')
}

// Get password from URL
function getPasswordFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  console.log(urlParams.get('password'))
  return urlParams.get('password')  
}

// Delete email & password from URL
function clearURL() {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.delete('email')
  urlParams.delete('password')
  const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '')
  window.history.replaceState({}, '', newUrl)
}
  
async function auth() {
  
  const users = await getAll('users')
  const email = getEmailFromURL()
  const password = getPasswordFromURL()

  if (await authenticateUser(users, email, password)) {
    const user = getUserByEmail(users, email)
    console.log(`User authenticated: ${user.name}`)
    clearURL()
  } else {
    console.error('Error authenticating user')
    window.location.href = `../auth/login.html`
  }

}
