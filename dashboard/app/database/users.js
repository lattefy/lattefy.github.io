
// Display Users
function displayUsersTable(users) {

    const userOutput = document.getElementById('allUsers')
    userOutput.innerHTML = ''
    const fieldsToAvoid = [
        '_id', 'businessid', 'createdat', 'updatedat', 'password', '__v'
    ]

    let rows = users.map(client => {
        let row = '<tr>'
        Object.entries(client).forEach(([key, value]) => {
            if (!fieldsToAvoid.includes(key.toLowerCase())) {
                row += `<td data-label="${capitalizeFirstLetter(key)}">${value}</td>`
            }
        })
        row += '</tr>'
        return row
    }).join('')
    
    userOutput.innerHTML = rows
    
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}