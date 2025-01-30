// Lattefy's wallet script


// Hide toolbar

window.addEventListener("load",function() {
    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1)
    }, 0)
})

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