// Lattefy's frontend dashboard script file

// Auth menu
if (document.getElementById('login')) {
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
} else {

    // Side bar
    document.addEventListener('DOMContentLoaded', function () {
        const sidebarBtn = document.getElementById('sidebar-btn')
        const sidebar = document.querySelector('.sidebar')
        const mainContent = document.querySelector('.main')
        const navbar = document.querySelector('.navbar')
      
        sidebarBtn.addEventListener('click', function () {
            sidebar.classList.toggle('active')
            document.body.classList.toggle('collapsed-sidebar')
            mainContent.classList.toggle('full-width')
            navbar.classList.toggle('full-width')
        })
    })

}