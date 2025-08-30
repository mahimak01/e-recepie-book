// Navbar shrink on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('shrink');
  else navbar.classList.remove('shrink');
});
//for slection of category

//for active  page
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop(); 
  const menuLinks = document.querySelectorAll("#menuItem a");

  menuLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

//backbtn
document.getElementById("backBtn").addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "homePage.html";
  }
});
});

document.querySelectorAll(".heart-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const card = this.closest(".recipe-card");
    const recipe = {
      id: card.dataset.id,
      title: card.dataset.title,
      img: card.dataset.img
    };

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (this.classList.contains("active")) {
      // Remove from favorites
      favorites = favorites.filter(r => r.id !== recipe.id);
      this.classList.remove("active");
    } else {
      // Add to favorites
      favorites.push(recipe);
      this.classList.add("active");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  });
});

   window.addEventListener("load", () => {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const container = document.getElementById("favoritesContainer");
    });
    document.addEventListener("DOMContentLoaded", () => {
  const favGrid = document.getElementById("favGrid");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    favGrid.innerHTML = "<p class='text-center'>No favorites yet!</p>";
    return;
  }

  favorites.forEach(fav => {
    const div = document.createElement("div");
    div.classList.add("col-md-4", "mb-4");

    div.innerHTML = `
      <div class="recipe-card position-relative rounded-3">
        <img src="${fav.image}" alt="${fav.title}">
        <div class="recipe-overlay">
          <div class="recipe-time">${fav.time}</div>
          <div class="recipe-title fw-bold lh-1.2 fs-5">${fav.title}</div>
        </div>
      </div>
    `;

    // When clicked, go to single-recipe.html (you can pass title in URL)
    div.addEventListener("click", () => {
      window.location.href = "method.html?title=" + encodeURIComponent(fav.title);
    });

    favGrid.appendChild(div);
  });
});
document.addEventListener("DOMContentLoaded", () => {
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