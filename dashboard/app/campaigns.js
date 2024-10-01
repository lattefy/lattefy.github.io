/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------------------- CAMPAIGNS ------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

// Function to send emails using EmailJS
async function sendCampaignEmail(clients, title, content, imageUrl) {

    try {
        for (const client of clients) {
            if (!client.email) {
                console.error(`Missing email for client: ${client.name}`)
                continue
            }
    
            const templateParams = {
                to_email: client.email,
                name: client.name,
                title: title,
                content: content,
                image_url: imageUrl || ''
            }
    
            await emailjs.send("service_w0y5b66", "template_d029ld1", templateParams)
    
        }
        alert('Campaña enviada con exito!')
    } 
    catch (error) {
        console.error('Error sending campaign emails:', error)
        alert('Error al enviar la campaña.')
    }
    
}
    
// Function to upload images to Cloudinary
async function uploadImageToCloudinary(imageFile) {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', 'my_unsigned_preset')

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