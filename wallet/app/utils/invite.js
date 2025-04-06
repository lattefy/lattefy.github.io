// Lattefy's frontend wallet invite file

const inviteBtn = document.getElementById('invite-btn') // or querySelector if you prefer

inviteBtn.addEventListener('click', async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Lattefy',
                text: 'Mirá esta app que te da beneficios en restaurantes favoritos!!!',
                url: 'https://lattefy.com.uy' // Your website link
            })
            console.log('Thanks for sharing!')
        } catch (error) {
            console.error('Error sharing:', error)
        }
    } else {
        alert('Tu dispositivo no soporta compartir desde el navegador.')
    }
})


