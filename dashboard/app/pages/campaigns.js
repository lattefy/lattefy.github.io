// Lattefy's frontend dashboard campaigns file

emailjs.init('Cv6Kl2E7kwi4IO4GQ')

// Function to send campaign emails
async function sendCampaignEmail(audience, businessTemplateId, title, content, imageUrl) {

    const template = await getTemplateById(businessTemplateId)

    let successCount = 0
    let errorCount = 0

    const serviceId = template.emailServiceId
    const templateId = template.emailTemplateId

    for (const client of audience) {

        if (!client.email) {
            console.error(`Missing email for client: ${client.name}`)
            errorCount++
            continue
        }

        const templateParams = {
            from_name: template.businessName,
            reply_to: template.contactEmail,

            to_email: client.email,
            name: client.name,
            
            title: title,
            content: content,
            image_url: imageUrl || ''
        }

        try {
            await emailjs.send(serviceId, templateId, templateParams)
            successCount++
        } catch (error) {
            console.error(`Error sending email to ${client.email}:`, error)
            errorCount++
        }
        
    }
    alert(`Campaña enviada con exito! ${successCount} correos enviados, ${errorCount} errores.`)
}


// Function to upload images to Cloudinary 
async function uploadImageToCloudinary(imageFile, folderName) {

    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', 'my_unsigned_preset') 
    formData.append('folder', folderName) 

    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/djassgqhi/image/upload', {
            method: 'POST',
            body: formData
        })
        const data = await response.json()
    
        if (response.ok) {
            return data.secure_url
        } else {
            throw new Error(data.error.message)
        }
    } catch (error) {
        console.error('Error uploading the image:', error)
        alert('Error al cargar el archivo.')
    }
}


// Display audience
async function displayAudienceSize(audience) {
    console.log('Tamaño de la audiencia:', audience.length)
    const audienceElement = document.getElementById('audience-size')
    audienceElement.textContent = `Tamaño de la audiencia: ${audience.length}`
}


// Function to filter clients
async function filterClients(clients, variable, condition, value) {
    console.log(`Filtrando por ${variable} con condición ${condition} y valor "${value}"`)

    return clients.filter(client => {
        const clientValue = client[variable]

        // Handle string comparison
        const clientStringValue = clientValue?.toString().toLowerCase() || ''
        const filterValue = value.toLowerCase()

        if (condition === 'contains') return clientStringValue.includes(filterValue)
        if (condition === 'not-contains') return !clientStringValue.includes(filterValue)

        return false
    })
}
