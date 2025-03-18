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
}

menu.onclick = function(){
    menu.classList.toggle("active")
    burger.classList.toggle("active")
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
