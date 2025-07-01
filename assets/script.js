// Lattefy | Uy Software Company - landing page






document.addEventListener('DOMContentLoaded', function () {

  // NavBar Menu
  if (document.getElementById('nav')) {
    burger = document.querySelector(".burger")
    menu = document.querySelector(".menu")
  
    burger.onclick = function(){
      burger.classList.toggle("active")
      menu.classList.toggle("active")
    }
  
    menu.onclick = function(){
      menu.classList.toggle("active")
      burger.classList.toggle("active")
    }

  }

  // At top NavBar
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY === 0) {
      nav.classList.add('at-top');
    } else {
      nav.classList.remove('at-top');
    }
  });

  // Hide NavBar on Scroll
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  function handleScroll() {
    const nav = document.getElementById("nav");
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down
      nav.classList.add("nav-hidden");
    } else {
      // Scrolling up
      nav.classList.remove("nav-hidden");
    }

    lastScrollY = currentScrollY;
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

  // Card Selector
  if (document.getElementById('cards')) {
    const toggleSwitch = document.getElementById("toggle-switch");
    const options = toggleSwitch.querySelectorAll(".option");
    const pointsCard = document.getElementById("points-card");
    const giftCard = document.getElementById("gift-card");
    const discountCard = document.getElementById("discount-card"); 

    function updateCardsDisplay(selectedOption) {
      pointsCard.classList.add("hidden");
      giftCard.classList.add("hidden");
      discountCard.classList.add("hidden");

      if (selectedOption === "cuponera") {
          pointsCard.classList.remove("hidden");
      } else if (selectedOption === "regalo") {
          giftCard.classList.remove("hidden");
      } else if (selectedOption === "discount") {
          discountCard.classList.remove("hidden");
      }
    }

    options.forEach((option, index) => {
        option.addEventListener("click", function () {
            // Remove active class from all options
            options.forEach(opt => opt.classList.remove("active"));
            // Add active class to the clicked option
            option.classList.add("active");

            // Update toggle background position
            toggleSwitch.classList.remove("active-1", "active-2", "active-3");
            toggleSwitch.classList.add(`active-${index + 1}`);

            // Update card display based on selection
            updateCardsDisplay(option.dataset.option);
        });
    });

    // Update Display on Window Resize
    window.addEventListener("resize", () => {
        const activeOption = document.querySelector(".option.active");
        updateCardsDisplay(activeOption.dataset.option);
    });

    // Initial Display Setup
    updateCardsDisplay(document.querySelector(".option.active").dataset.option);
  }

  // FAQs Animation
  if (document.getElementById('faqs')) {
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
  }
})












// var formBtn = document.getElementById("form-btn")

// formBtn.addEventListener('click', function() {
//   window.open(
//     'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3klyCDkaLkpVv7koIvli2WPb5PF5PVgfMeVgdVJdjBG6zZjZKgjEswSOsCF28E-Qw1kxn7_gbz?gv=true', 
//     'Meeting Window', 
//   )

// })


var contactBtn = document.getElementById("contact-btn")

contactBtn.addEventListener('click', function(e){
  e.preventDefault()

  var nombre = document.getElementById('name')
  var email = document.getElementById('email')
  var msg = document.getElementById('msg')

  var body = '<br/> name: ' + nombre.value + 
             '<br/> email: ' + email.value + 
             '<br/> message: ' + msg.value 
             

  function clearInputs(){
    nombre.value = ""
    email.value = ""
    msg.value = ""
  }

  Email.send({
    SecureToken : "30d7ca7d-d42b-4b38-a8cd-e6fb6521274d",
    To : 'lattefy.ai@gmail.com',
    From : 'lattefy.ai@gmail.com',
    Subject : "Lattefy | Contact Message",
    Body : body
  }).then(
    message => alert("Tu mensaje fue enviado, pronto te llegara una respuesta!")
  )

  clearInputs()
  
})
