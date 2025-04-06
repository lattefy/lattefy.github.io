// Lattefy's frontend wallet script


// Hide toolbar

window.addEventListener("load",function() {
    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1)
    }, 0)
})

// menu - toggle Responsive Menu:

burger = document.querySelector(".burger")
menu = document.querySelector(".menu")

burger.onclick = function(){
    menu.classList.toggle("active")
    burger.classList.toggle("active")
    console.log("Burger clicked")
}

// Check animation

if (document.getElementById("done")) {
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            document.querySelector("#done .container").classList.add("show-text")
        }, 600) 
    })
}

if (document.getElementById("discover")) {
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            document.querySelector("#discover #confirmation").classList.add("show-text")
        }, 600) 
    })
}

// Discover Icon animation

const navIconBtn = document.querySelector('.btn.nav-btn')
if (navIconBtn) {
    setInterval(() => {
        navIconBtn.classList.toggle('active')
    }, 3000)
}
