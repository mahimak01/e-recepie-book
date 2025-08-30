

// Navbar shrink on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('shrink');
  else navbar.classList.remove('shrink');
});
// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {


    // 3. Category buttons (veg, nonveg, etc.)
    const categoryBtns = document.querySelectorAll(".categoryBtn");
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const category = btn.getAttribute("data-category");
            window.location.href = `category.html?type=${category}`;
        });
    });

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



