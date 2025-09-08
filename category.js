// Navbar shrink on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('shrink');
  else navbar.classList.remove('shrink');
});
//for slection of category
document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll(".categoryButton");
  const categorySections = document.querySelectorAll(".categorySection");
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get("type");

  if (urlCategory) {
    filterRecipes(urlCategory);
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedCategory = btn.getAttribute("data-category");
      filterRecipes(selectedCategory);
    });
  });

  function filterRecipes(category) {
    categorySections.forEach(card => {
      if (category === "all" || card.getAttribute("data-category") === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }
  
});

//for active  page
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  const menuLinks = document.querySelectorAll("#menuItem a");

  menuLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
  //on click recipe card
  const recipeCards = document.querySelectorAll(".recipe-card");
  recipeCards.forEach(card => {
    card.addEventListener("click", () => {
      window.location.href = "method.html";
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
  
});
//like btn
document.addEventListener("DOMContentLoaded", () => {
  const likeButtons = document.querySelectorAll(".like-btn");
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  likeButtons.forEach(btn => {
    const card = btn.closest(".recipe-card");
    const title = card.querySelector(".recipe-title").innerText;

    if (favorites.some(f => f.title === title)) {
      btn.classList.add("liked");
    }

    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      btn.classList.toggle("liked");
      const recipe = {
        title: title,
        image: card.querySelector("img").src,
        time: card.querySelector(".recipe-time").innerText
      };

      if (btn.classList.contains("liked")) {
        favorites.push(recipe);
      } else {
        favorites = favorites.filter(f => f.title !== title);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
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
})
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


