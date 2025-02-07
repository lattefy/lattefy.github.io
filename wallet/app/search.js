// Lattefy's frontend wallet search file

function setupSearch(inputId, containerId, itemClass, textClass) {
    const searchInput = document.getElementById(inputId)
    const container = document.getElementById(containerId)

    if (!searchInput || !container) {
        console.error("Search input or container not found!")
        return
    }

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase()
        const items = container.getElementsByClassName(itemClass)

        Array.from(items).forEach(item => {
            const textElement = item.querySelector(textClass)
            const text = textElement ? textElement.innerText.toLowerCase() : ""

            if (text.includes(searchTerm)) {
                item.style.display = "block"
            } else {
                item.style.display = "none"
            }
        })
    })
}

