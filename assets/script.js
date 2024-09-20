// Lattefy | Dashboard - General JavaScript file

// Sidebar

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
