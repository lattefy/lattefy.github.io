// Lattefy's frontend wallet emails file

emailjs.init('Cv6Kl2E7kwi4IO4GQ')

// Send business emails function
async function sendBusinessEmail(clientPhoneNumber, templateId, type) {

    const template = await getTemplate(templateId)
    const client = await getClient(clientPhoneNumber)

    let title
    let imageUrl

    // Email Type
    if (type === 'card') {
        imageUrl = template.cardEmailImg
        title = template.cardEmailTitle
    } else if (type === 'reward') {
        imageUrl = template.rewardEmailImg
        title = template.rewardEmailTitle
    } else {
        console.error('Error: Invalid email type')
        return
    }
  
    try {
    
        const templateParams = {
          from_name: template.businessName,
          reply_to: template.contactEmail,
  
          to_email: client.email,
          name: client.name,
  
          title: title,
          image_url: imageUrl || ''
        }
  
        const serviceId = template.emailServiceId
        const templateId =  template.emailTemplateId

        if (serviceId && templateId) {
            await emailjs.send(serviceId, templateId, templateParams)
            console.log('Email sent successfully')
        }

    } 
    catch (error) {
        console.error('Error sending email:', error)
    }
    
}