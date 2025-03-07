// Lattefy | Uy Software Company - landing page


// Card Info. Animation

// FAQs Animation

document.addEventListener('DOMContentLoaded', function () {
  const faqs = document.querySelectorAll('.faq')

  faqs.forEach(faq => {
      const header = faq.querySelector('.header i')
      header.addEventListener('click', () => {
          faqs.forEach(item => {
              if (item !== faq) {
                  item.classList.remove('active')
              }
          })

          faq.classList.toggle('active')
      })
  })
})


// Confetti Animation:

function createConfetti() {
  const confettiContainer = document.querySelector('.news')
  const confettiColors = ['#1DB954', '#1ed760', '#1aa34a', '#1b9e46', '#189541', '#148c3d']
  const confettiCount = 50

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.classList.add('confetti')
    confetti.style.left = `${Math.random() * 100}vw`
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`
    confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)]
    confettiContainer.appendChild(confetti)
  }
}
createConfetti()


// NavBar - toggle Responsive Menu:

burger = document.querySelector(".burger")
navBar = document.querySelector(".menu")

burger.onclick = function(){
    navBar.classList.toggle("active")
    burger.classList.toggle("active")
}

navBar.onclick = function(){
    navBar.classList.toggle("active")
    burger.classList.toggle("active")
}


// On Scroll effects

window.addEventListener('scroll', reveal)

function reveal(){
  var reveals = document.querySelectorAll('.reveal')

  for(var i = 0; i < reveals.length; i++){
    var windowheight = window.innerHeight
    var revealtop = reveals[i].getBoundingClientRect().top
    var revealpoint = 150

    if(revealtop < windowheight - revealpoint){
      reveals[i].classList.add('active')
    }else{
      reveals[i].classList.remove('active')
    }
  }
}


// var formBtn = document.getElementById("form-btn")

// formBtn.addEventListener('click', function() {
//   window.open(
//     'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3klyCDkaLkpVv7koIvli2WPb5PF5PVgfMeVgdVJdjBG6zZjZKgjEswSOsCF28E-Qw1kxn7_gbz?gv=true', 
//     'Meeting Window', 
//   )

// })


// var contactBtn = document.getElementById("contact-btn")

// contactBtn.addEventListener('click', function(e){
//   e.preventDefault()

//   var nombre = document.getElementById('name')
//   var empresa = document.getElementById('business')
//   var email = document.getElementById('email')
//   var phoneNumber = document.getElementById('phone-number')
//   var msg = document.getElementById('msg')

//   var body = '<br/> name: ' + nombre.value + '<br/> business: ' + empresa.value + 
//              '<br/> email: ' + email.value + '<br/> phone number: ' + phoneNumber.value +
//              '<br/> message: ' + msg.value 
             

//   function clearInputs(){
//     nombre.value = ""
//     empresa.value = ""
//     email.value = ""
//     phoneNumber.value = ""
//     msg.value = ""
//   }

//   Email.send({
//     SecureToken : "09c36a42-e397-48c2-a1a7-7a86178c331c",
//     To : 'fusion.labs.uy@gmail.com',
//     From : 'fusion.labs.uy@gmail.com',
//     Subject : "Lattefy | Contact Message",
//     Body : body
//   }).then(
//     message => alert("Tu mensaje fue enviado, pronto te llegara una respuesta!")
//   )

//   clearInputs()
  
// })