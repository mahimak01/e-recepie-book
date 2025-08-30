

// Navbar shrink on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('shrink');
  else navbar.classList.remove('shrink');
});
// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {


 

    //   favorites page
    const favBtn = document.getElementById("viewAllFavorites");
    if (favBtn) {
        favBtn.addEventListener("click", () => {
            window.location.href = "favorites.html";
        });
    }

    // About us & More pages
    const aboutBtn = document.getElementById("aboutBtn");
    if (aboutBtn) {
        aboutBtn.addEventListener("click", () => {
            window.location.href = "about.html";
        });
    }


});
//for active nav bar
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    const menuLinks = document.querySelectorAll("#menuItem a");

    menuLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});

//backbtn
document.getElementById("backBtn").addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "homePage.html";
  }
});


