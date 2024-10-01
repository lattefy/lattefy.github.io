/* --------------------------------------------------------------------------------------------------*/
/* ---------------------------------------- DISPLAY CLIENTS ---------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

function initializeSortAndFilter(clients) {

    // Sort and filter elements
    const sortVariable = document.getElementById('sort-variable')
    const sortOrder = document.getElementById('sort-order')
    const filterVariable = document.getElementById('filter-variable')
    const filterCondition = document.getElementById('filter-condition')
    const filterValue = document.getElementById('filter-value')
    const applyBtn = document.getElementById('apply-btn')
    const resetBtn = document.getElementById('reset-btn')

    function applySortAndFilter() {
        
        let sortedFilteredClients = [...clients]

        // Apply filtering
        const filterVar = filterVariable.value
        const filterCond = filterCondition.value
        const filterVal = filterValue.value.toLowerCase()

        if (filterVal) {
            sortedFilteredClients = sortedFilteredClients.filter(client => {
                const value = client[filterVar]?.toString().toLowerCase() || ''
                return filterCond === 'contains' ? value.includes(filterVal) : !value.includes(filterVal)
            })
        }

        // Apply sorting
        const sortVar = sortVariable.value
        const sortOrd = sortOrder.value

        sortedFilteredClients.sort((a, b) => {
            const aValue = a[sortVar]
            const bValue = b[sortVar]
            if (aValue < bValue) return sortOrd === 'asc' ? -1 : 1
            if (aValue > bValue) return sortOrd === 'asc' ? 1 : -1
            return 0
        })

        displayClients(sortedFilteredClients)

    }

    // Apply sorting and filtering when the apply button is clicked
    applyBtn.addEventListener('click', applySortAndFilter)

    // Reset filters and sorting
    resetBtn.addEventListener('click', function () {
        filterVariable.value = 'name'
        filterCondition.value = 'contains'
        filterValue.value = ''
        sortVariable.value = 'name'
        sortOrder.value = 'asc'
        displayClients(clients)
    })

    function displayClients(clients) {
        const clientOutput = document.getElementById('allClients')
        clientOutput.innerHTML = ''
        const fieldsToAvoid = [
            '_id', 'lastrating', 'emissiondate', 'expirationdate', 'discountsgotten', 'discountavailable', 'totalspent', '__v'
        ]

        clients.forEach(client => {
            const row = document.createElement('tr')

            Object.entries(client).forEach(([key, value]) => {
                if (!fieldsToAvoid.includes(key.toLowerCase())) {
                    const cell = document.createElement('td')
                    cell.textContent = value
                    cell.setAttribute('data-label', capitalizeFirstLetter(key))
                    row.appendChild(cell)
                }
            })

            clientOutput.appendChild(row)
        })
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    // Initial display
    displayClients(clients)
}


/* ----------------------------------------- Dashboard Table -------------------------------------- */

function displayClients(clients) {

    const clientOutput = document.getElementById('allClients')
    clientOutput.innerHTML = ''
    const fieldsToAvoid = [
        '_id', 'lastrating', 'emissiondate', 'expirationdate', 'discountsclaimed', 'discountsgotten', 'discountavailable', 'totalspent', 'averageexpenditure', '__v'
    ]

    let rows = clients.map(client => {
        let row = '<tr>'
        Object.entries(client).forEach(([key, value]) => {
            if (!fieldsToAvoid.includes(key.toLowerCase())) {
                row += `<td data-label="${capitalizeFirstLetter(key)}">${value}</td>`
            }
        })
        row += '</tr>'
        return row
    }).join('')
    
    clientOutput.innerHTML = rows
    
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}