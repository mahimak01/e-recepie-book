
// Navbar shrink on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('shrink');
  else navbar.classList.remove('shrink');
});
// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {



    // 4. View all favorites → favorites page
    const favBtn = document.getElementById("viewAllFavorites");
    if (favBtn) {
        favBtn.addEventListener("click", () => {
            window.location.href = "favorites.html";
        });
    }



    // 6. About us & More pages
    const aboutBtn = document.getElementById("aboutBtn");
    if (aboutBtn) {
        aboutBtn.addEventListener("click", () => {
            window.location.href = "about.html";
        });
    }


});
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

// on clik on continue btn
document.addEventListener("DOMContentLoaded", () => {
  const continueButtons = document.querySelectorAll(".continue-btn");

  continueButtons.forEach(button => {
    button.addEventListener("click", () => {
      const blogId = button.getAttribute("data-id"); 
      window.location.href = `blogDetail.html?id=${blogId}`;
    });
  });
});

