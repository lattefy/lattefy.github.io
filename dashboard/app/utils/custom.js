// Lattefy's frontend dashboard custom file

// Function to display business name
async function displayBusinessName(user) {
    try {
        if (!user) {
            console.error("User does not have a valid businessId")
            document.getElementById("business-name").textContent = "No Business Assigned"
            return
        }

        const business = await getBusinessById(user.businessId)

        if (!business || business.message === "Business not found") {
            document.getElementById("business-name").textContent = "Business Not Found"
        } else {
            document.getElementById("business-name").textContent = business.name
        }
    } catch (error) {
        console.error("Error displaying business name:", error)
        document.getElementById("business-name").textContent = "Error Loading Business"
    }
}

async function displaySidebarBtns(business, role) {
    if (!business) return

    const sidebarMenu = document.querySelector(".menu")
    sidebarMenu.innerHTML = ""

    const buttons = [
        { id: "dashboard-sidebar-btn", href: "index.html", icon: "ph-squares-four", label: "Dashboard" }
    ]

    // Check templateIds and add corresponding buttons
    if (business.templateIds) {
        business.templateIds.forEach(templateId => {
            const firstDigit = templateId.toString().charAt(0);

            if (firstDigit === "1") {
                buttons.push({ id: "points-sidebar-btn", href: "points.html", icon: "ph-plus-circle", label: "Sumar Puntos" });
            } else if (firstDigit === "2") {
                buttons.push({ id: "rewards-sidebar-btn", href: "gifts.html", icon: "ph-gift", label: "Reclamar Regalos" });
            } else if (firstDigit === "3") {
                buttons.push({ id: "discounts-sidebar-btn", href: "discounts.html", icon: "ph-tag", label: "Descuentos" });
            }
        })
    }

    if (role === "manager" || role === "admin") {
        buttons.push(
            { id: "campaigns-sidebar-btn", href: "campaigns.html", icon: "ph-envelope", label: "Campañas" },
            { id: "export-sidebar-btn", href: "#", icon: "ph-export", label: "Exportar info." }
        )
    }

    buttons.forEach(button => {
        const li = document.createElement("li")
        li.id = button.id 

        li.innerHTML = `
            <a href="${button.href}">
                <i class="ph ${button.icon}"></i>
                <span class="link">${button.label}</span>
            </a>
        `

        sidebarMenu.appendChild(li)
    })
}

