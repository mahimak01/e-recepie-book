let slideIndex = 0;
const slides = document.querySelectorAll('.hero-slideshow .slide');

function showSlides() {
  if (!slides.length) return;

  slides.forEach(s => s.classList.remove('show'));
  slides[slideIndex].classList.add('show');

  slideIndex = (slideIndex + 1) % slides.length; 
}
showSlides();
setInterval(showSlides, 4000);

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('shrink');
  else navbar.classList.remove('shrink');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('inview');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// Wait until window loads
window.addEventListener("load", () => {
  const popup = document.getElementById("suggestionPopup");
  const closeBtn = document.getElementById("closePopup");
  const form = document.getElementById("suggestionForm");
  const toast = document.getElementById("toast");


  history.replaceState({ popup: false }, "", location.pathname);

 
  setTimeout(() => {
    if (!sessionStorage.getItem("suggestionDone")) {
      popup.style.display = "flex";
     
    }
  }, 3000);

  // Close button functionality
  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
    sessionStorage.setItem("suggestionDone", "true"); // mark for this session
    history.replaceState({ popup: false }, "", location.pathname);
  });

  // Form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stops page reload

    // Get values
    const dish = document.getElementById("dish").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const comment = document.getElementById("comment").value;

    // Store in localStorage (data stays permanent)
    let suggestions = JSON.parse(localStorage.getItem("suggestions")) || [];
    suggestions.push({ dish, name, email, comment });
    localStorage.setItem("suggestions", JSON.stringify(suggestions));

    // Mark suggestion done (for this session only)
    sessionStorage.setItem("suggestionDone", "true");

    // Show toast
    showToast("Thank You For Your Precious Suggestion !");

    // Hide popup
    popup.style.display = "none";
    history.replaceState({ popup: false }, "", location.pathname);
  });

  // Toast function
  function showToast(message) {
    toast.innerHTML = message;
    toast.className = "show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }

  // Handle back/forward button
  window.addEventListener("popstate", () => {
    // Always hide popup on navigation
    popup.style.display = "none";
  });
});


// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // 1. Explore button → open category page
    const exploreBtn = document.getElementById("exploreBtn");
    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
            window.location.href = "category.html";
        });
    }

    // 2. Search button → show input, then search
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");

    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            searchInput.style.display = (searchInput.style.display === "block") ? "none" : "block";
            searchInput.focus();
        });

        // On Enter key → open recipe single page
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && searchInput.value.trim() !== "") {
                window.location.href = `method.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }

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

    // 5. View best recipes → category page
    const bestBtn = document.getElementById("viewBestRecipes");
    if (bestBtn) {
        bestBtn.addEventListener("click", () => {
            window.location.href = "category.html?type=best";
        });
    }

    // 6. About us & More pages
    const aboutBtn = document.getElementById("aboutBtn");
    if (aboutBtn) {
        aboutBtn.addEventListener("click", () => {
            window.location.href = "about.html";
        });
    }

    const moreBtn = document.getElementById("moreBtn");
    if (moreBtn) {
        moreBtn.addEventListener("click", () => {
            window.location.href = "blog.html";
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



