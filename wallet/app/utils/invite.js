// Lattefy's frontend wallet invite utils file:


const inviteBtn = document.getElementById('invite-btn') 

inviteBtn.addEventListener('click', async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Lattefy',
                text: 'Mirá esta app que te da beneficios en tus restaurantes favoritos!!!    ',
                url: 'https://lattefy.com.uy' 
            })
            console.log('Thanks for sharing!')
        } catch (error) {
            console.error('Error sharing:', error)
        }
    } else {
        alert('Tu dispositivo no soporta compartir desde el navegador.')
    }
})



// Share Card

function setupCardSharing(card, template) {
    const shareBtn = document.getElementById('share-card-btn')
    if (!shareBtn) return

    shareBtn.addEventListener('click', async () => {
    const { templateId, businessId } = card || {}
    if (!templateId || !businessId) {
        return alert('Faltan datos para compartir esta tarjeta.')
    }

    const shareUrl = `https://lattefy.com.uy/wallet?t=${templateId}&b=${businessId}`

    if (navigator.share) {
        try {
        await navigator.share({
            title: `Conseguí tu ${template.header} y lleváte una ${template.reward || template.gift} de regalo!`,
            url: shareUrl
        })
        console.log('Tarjeta compartida con éxito')
        } catch (err) {
        console.error('Error al compartir:', err)
        }
    } else {
        alert('Tu dispositivo no soporta la función de compartir.')
    }
    })
}