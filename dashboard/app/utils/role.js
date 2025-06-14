// Lattefy's frontend dashboard role file

async function checkRole(userRole, authRoles) {
    if (!authRoles.includes(userRole)) {
        window.location.href = './login.html'
    }
}
