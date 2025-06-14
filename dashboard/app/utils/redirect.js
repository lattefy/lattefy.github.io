// Lattefy's frontend dahboard redirect file:

async function redirectToMainPage(user) {
    console.log("Redirecting user:", user)
    if (!user) {
        console.error("User is not logged in")
        window.location.href = "login.html"
        return
    }
    if (!user.businessId) {
        console.error("User does not have a valid businessId")
        window.location.href = "error.html"
        return
    }
    const business = await getBusinessById(user.businessId)
    if (user.role === "admin") {
        window.location.href = "admin.html"
    } else if (user.role === "manager") {
        window.location.href = "manager.html"
    } else if (user.role === "employee") {
        if (business && business.templateIds) {
            const firstDigit = business.templateIds[0].toString().charAt(0)
            console.log("First digit of template ID:", firstDigit)
            if (firstDigit === "1") {
                window.location.href = "points.html"
            } else if (firstDigit === "2") {
                window.location.href = "gifts.html"
            } else if (firstDigit === "3") {
                window.location.href = "discounts.html"
            } else {
                console.error("Unknown template ID:", business.templateIds[0])
                window.location.href = "error.html"
            }
        }
    } else {
        console.error("Unknown role:", user.role)
        window.location.href = "login.html"
    }
}