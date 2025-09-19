// ========================
// Navbar shrink on scroll
// ========================
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("shrink", window.scrollY > 60);
});

// ========================
// Run once DOM is ready
// ========================
document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "http://localhost:3000";
  const grid = document.getElementById("recipeGrid");
  const catBtns = document.querySelectorAll(".categoryButton");

  // ------------------------
  // 1. Navbar menu & backBtn
  // ------------------------
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("#menuItem a").forEach(link => {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  });

  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "homePage.html";
    });
  }

  // ------------------------
  // 2. Categories
  // ------------------------
  const catMap = {
    vegetarian: "veg",
    "non-veg": "nonveg",
    healthy: "salad",
    juices: "juices",
    dessert: "dessert"
  };
  let allRecipes = [];

  function setActiveCategory(key) {
    catBtns.forEach(b =>
      b.classList.toggle("active", b.dataset.category === key)
    );
  }

  function getCategoryValue(recipe) {
    const c = recipe.category;
    if (!c) return "";
    return typeof c === "string"
      ? c
      : (c.slug || c.name || c.key || "").toString();
  }

  function renderCategory(key) {
    const backendCat = catMap[key] || key;
    const filtered = backendCat
      ? allRecipes.filter(
          r => getCategoryValue(r).toLowerCase() === backendCat.toLowerCase()
        )
      : [];

    renderGrid(filtered);
    setActiveCategory(key);
  }

  // ------------------------
  // 3. Grid rendering
  // ------------------------
  function renderGrid(recipes) {
    const wrapper = document.createElement("div");
    wrapper.className = "container";
    const row = document.createElement("div");
    row.className = "row";
    wrapper.appendChild(row);

    if (!recipes.length) {
      row.innerHTML = `<p class="text-center">No recipes found.</p>`;
    } else {
      const frag = document.createDocumentFragment();
      recipes.forEach(r => {
        const col = document.createElement("div");
        col.className = "col-md-4 col-sm-6 mb-4";
        col.innerHTML = `
          <div class="recipe-card position-relative rounded-3" data-id="${
            r._id || r.id || ""
          }">
            <img src="${
              r.image || r.imageUrl || "/Images/default.jpg"
            }" class="img-fluid" alt="${r.name || "Recipe"}">
            <button class="like-btn"><i class="fa fa-heart fs-5 rounded-circle py-1 px-1"></i></button>
            <div class="recipe-overlay">
              <div class="recipe-time"><i class="bi bi-clock fs-6 me-1"></i> ${
                r.time || "N/A"
              }</div>
              <div class="recipe-title fw-bold lh-1.2 fs-5">${
                r.name || "Unnamed"
              }</div>
            </div>
          </div>`;
        frag.appendChild(col);
      });
      row.appendChild(frag);
    }

    grid.innerHTML = "";
    grid.appendChild(wrapper);

    // Restore liked state after rendering
    markActiveHearts(grid);
  }

  // ------------------------
  // 4. Load recipes from backend
  // ------------------------
  async function loadAllRecipes() {
    try {
      const res = await fetch(`${BASE_URL}/api/recipes`, {
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allRecipes = Array.isArray(data.recipes)
        ? data.recipes
        : Array.isArray(data)
        ? data
        : [];

      // get category from URL (default to vegetarian if not provided)
      const params = new URLSearchParams(window.location.search);
      const catType = params.get("type") || "vegetarian";
      renderCategory(catType);
    } catch (e) {
      console.error("Load failed:", e);
      grid.innerHTML = `<p class="text-danger text-center">Unable to load recipes.</p>`;
    }
  }

  // ------------------------
  // 5. Favorites (localStorage + backend sync)
  // ------------------------
  // ------------------------
// 5. Favorites (localStorage + backend sync)
// ------------------------
function loadFavs() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch {
    return [];
  }
}

function saveFavs(arr) {
  localStorage.setItem("favorites", JSON.stringify(arr));
}

function markActiveHearts(container) {
  const favorites = loadFavs();
  const ids = new Set(favorites.map(f => f.id));
  container.querySelectorAll(".recipe-card").forEach(card => {
    const id = card.dataset.id;
    const heart = card.querySelector(".like-btn i");
    if (heart) {
      if (id && ids.has(id)) {
        heart.classList.add("text-danger"); // red heart
        card.querySelector(".like-btn").classList.add("liked");
      } else {
        heart.classList.remove("text-danger");
        card.querySelector(".like-btn").classList.remove("liked");
      }
    }
  });
}

async function toggleLike(card, likeBtn) {
  const id = card.dataset.id;
  if (!id) return;

  const heartIcon = likeBtn.querySelector("i");
  const title = card.querySelector(".recipe-title")?.innerText?.trim() || "";
  const image = card.querySelector("img")?.src || "";
  const time = card.querySelector(".recipe-time")?.innerText?.trim() || "";

  let favs = loadFavs();
  const alreadyLiked = favs.some(f => f.id === id);

  if (alreadyLiked) {
    // Remove from favorites
    favs = favs.filter(f => f.id !== id);
    heartIcon.classList.remove("text-danger");
    likeBtn.classList.remove("liked");
  } else {
    // Add to favorites
    favs.push({ id, title, image, time });
    heartIcon.classList.add("text-danger");
    likeBtn.classList.add("liked");
  }

  saveFavs(favs);

  // Optional: sync with backend
  try {
    const res = await fetch(`${BASE_URL}/api/recipes/${encodeURIComponent(id)}/like`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ like: !alreadyLiked })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.warn("Like sync failed:", err);
  }
}

  // ------------------------
  // 6. Event listeners
  // ------------------------
  // Category buttons
  document.body.addEventListener("click", e => {
    const btn = e.target.closest(".categoryButton");
    if (btn) {
      renderCategory(btn.dataset.category);
      // update URL without reloading
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("type", btn.dataset.category);
      window.history.pushState({}, "", newUrl);
    }
  });

  // Recipe grid
  grid.addEventListener("click", e => {
    const likeBtn = e.target.closest(".like-btn");
    const card = e.target.closest(".recipe-card");

    if (likeBtn && card) {
      e.stopPropagation();
      toggleLike(card, likeBtn);
    } else if (card) {
      // go to recipe details
      window.location.href = `method.html?id=${encodeURIComponent(
        card.dataset.id
      )}`;
    }
  });

  // ------------------------
  // 7. Start
  // ------------------------
  loadAllRecipes();
});
