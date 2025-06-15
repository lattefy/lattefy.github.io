// Lattefy's frontend dashboard custom file

// Function to display business name
async function displayBusinessName(business) {
    try {
        // if (!user) {
        //     console.error("User does not have a valid businessId")
        //     document.getElementById("business-name").textContent = "No Business Assigned"
        //     return
        // }
        // const business = await getBusinessById(user.businessId)

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
        // { id: "dashboard-sidebar-btn", href: "index.html", icon: "ph-squares-four", label: "Dashboard" },
    ]

    if (role === "admin") {
        buttons.push(
            { id: "admin-sidebar-btn", href: "admin.html", icon: "ph-stack", label: "Dashboard" },
            { id: "manager-sidebar-btn", href: "manager.html", icon: "ph-squares-four", label: "Manager View" }
        )
    }

    if (role === "manager") {
        buttons.push(
            { id: "manager-sidebar-btn", href: "manager.html", icon: "ph-squares-four", label: "Dashboard" }
        )
    }

    if (role === "manager" || role === "admin") {
        buttons.push(
            { id: "campaigns-sidebar-btn", href: "campaigns.html", icon: "ph-envelope", label: "Campañas" },
            // { id: "export-sidebar-btn", href: "#", icon: "ph-export", label: "Exportar info." }
        )
    }

    // Check templateIds and add corresponding buttons
    if (business.templateIds) {
        business.templateIds.forEach(templateId => {
            const firstDigit = templateId.toString().charAt(0);

            if (firstDigit === "1") {
                buttons.push({ id: "points-sidebar-btn", href: "points.html", icon: "ph-plus-circle", label: "Sumar Puntos" });
            } else if (firstDigit === "2") {
                buttons.push({ id: "gifts-sidebar-btn", href: "gifts.html", icon: "ph-gift", label: "Reclamar Regalos" });
            } else if (firstDigit === "3") {
                buttons.push({ id: "discounts-sidebar-btn", href: "discounts.html", icon: "ph-tag", label: "Descuentos" });
            }
        })
    }

    buttons.push(
        { id: "clients-sidebar-btn", href: "https://lattefy.com.uy/wallet/signup.html", target: '_blank', icon: "ph-user-plus", label: "Registrar Cliente" }
    )

    buttons.forEach(button => {
        const li = document.createElement("li")
        li.id = button.id 

        li.innerHTML = `
            <a href="${button.href}" target="${button.target || '_self'}" class="link">
                <i class="ph ${button.icon}"></i>
                <span class="link">${button.label}</span>
            </a>
        `

        sidebarMenu.appendChild(li)
    })
}

