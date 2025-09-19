// ================== HERO SLIDESHOW ==================
let slideIndex = 0;
const slides = document.querySelectorAll('.hero-slideshow .slide');

function showSlides() {
  if (!slides.length) return; // no slides, exit

  slides.forEach(s => s.classList.remove('show')); // hide all
  slides[slideIndex].classList.add('show');        // show current

  // move to next slide
  slideIndex = (slideIndex + 1) % slides.length;
}

showSlides();
setInterval(showSlides, 4000); // auto-play every 4s

// ================== NAVBAR SHRINK ON SCROLL ==================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('shrink', window.scrollY > 60);
});

// ================== ANIMATIONS ON SCROLL ==================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('inview');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ================== POPUP SUGGESTION ==================
window.addEventListener("load", () => {
  const popup = document.getElementById("suggestionPopup");
  const closeBtn = document.getElementById("closePopup");
  const form = document.getElementById("suggestionForm");
  const toast = document.getElementById("toast");

  // Show popup only once per session after 3s
  setTimeout(() => {
    if (!sessionStorage.getItem("suggestionDone")) {
      popup.style.display = "flex";
    }
  }, 3000);

  // Close popup
  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
    sessionStorage.setItem("suggestionDone", "true");
  });

  // Submit suggestion
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const suggestion = {
      dish: document.getElementById("dish").value,
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      comment: document.getElementById("comment").value,
    };

    // Save to localStorage
    let all = JSON.parse(localStorage.getItem("suggestions")) || [];
    all.push(suggestion);
    localStorage.setItem("suggestions", JSON.stringify(all));

    sessionStorage.setItem("suggestionDone", "true");
    showToast("Thank You For Your Precious Suggestion !");
    popup.style.display = "none";
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.className = "show";
    setTimeout(() => toast.classList.remove("show"), 3000);
  }
});

// ================== MAIN NAVIGATION ==================
document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "http://localhost:3000";

  // Explore button
  const exploreBtn = document.getElementById("exploreBtn");
  if (exploreBtn) exploreBtn.addEventListener("click", () => location.href = "category.html");

  // Search feature
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  async function performSearch(query) {
    try {
      const res = await fetch(`${BASE_URL}/api/recipes?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("No recipes found");

      const data = await res.json();
      const recipes = data.recipes || data;

      if (!recipes.length) return alert("No recipes found.");

      // Save recipe & go to details
      localStorage.setItem("selectedRecipe", JSON.stringify(recipes[0]));
      location.href = "method.html";
    } catch (err) {
      console.error(err);
      alert("Error while searching.");
    }
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      if (searchInput.style.display !== "block") {
        searchInput.style.display = "block";
        searchInput.focus();
        return;
      }
      if (searchInput.value.trim()) performSearch(searchInput.value.trim());
      else alert("Please enter recipe name.");
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
      }
    });
  }

  // Category buttons
  document.querySelectorAll(".categoryBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-category");
      window.location.href = `category.html?type=${encodeURIComponent(cat)}`;
    });
  });

  // Favorites
  const favBtn = document.getElementById("viewAllFavorites");
  if (favBtn) favBtn.addEventListener("click", () => location.href = "favorites.html");

  // Best recipes
  const bestBtn = document.getElementById("viewBestRecipes");
  if (bestBtn) bestBtn.addEventListener("click", () => location.href = "category.html?type=best");

  // About
  const aboutBtn = document.getElementById("aboutBtn");
  if (aboutBtn) aboutBtn.addEventListener("click", () => location.href = "about.html");

  // Blog
  const moreBtn = document.getElementById("moreBtn");
  if (moreBtn) moreBtn.addEventListener("click", () => location.href = "blog.html");
  
});

// ================== ACTIVE PAGE HIGHLIGHT ==================
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = location.pathname.split("/").pop();
  document.querySelectorAll("#menuItem a").forEach(link => {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  });
});

// ================== BLOG PAGE CONTINUE BTN ==================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".continue-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const blogId = btn.getAttribute("data-id");
      location.href = `blogDetail.html?id=${blogId}`;
    });
  });
});

// =============== BACKEND INTEGRATION FOR HOME GRIDS ===============
const API_BASE = "http://localhost:3000"; // change if needed

async function fetchAllRecipes() {
  const res = await fetch(`${API_BASE}/api/recipes`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.recipes) ? data.recipes : (Array.isArray(data) ? data : []);
}

// Optional local favorites fallback (from Favorites page hearts)
function loadLocalFavorites() {
  try { return JSON.parse(localStorage.getItem("favorites")) || []; }
  catch { return []; }
}

// Save selection to open in method.html
function openRecipeDetail(rec) {
  localStorage.setItem("selectedRecipe", JSON.stringify(rec)); // used by method.html [web:61]
  location.href = "method.html";
}

// 1) MOST LOVE: exactly five favorites into your 3+2 grid
async function populateMostLove() {
  const tiles = [
    document.querySelector("#mostLove .image-01"),
    document.querySelector("#mostLove .image-02"),
    document.querySelector("#mostLove .image-03"),
    document.querySelector("#mostLove .image-04"),
    document.querySelector("#mostLove .image-05"),
  ];
  if (tiles.some(t => !t)) return; // grid not present

  try {
    const all = await fetchAllRecipes();
    let favs = all.filter(r => r.isFavorite === true);

    // Fallback: use locally saved favorites if backend has none/less
    if (favs.length < 5) {
      const localFavs = loadLocalFavorites();
      // Map local structure to recipe-like for consistent rendering
      const mapped = localFavs.map(f => ({
        id: f.id,
        _id: f.id,
        name: f.title,
        image: f.image,
        time: f.time
      }));
      // Merge unique by id, prioritizing backend data
      const byId = new Map(favs.map(r => [String(r._id || r.id), r]));
      for (const m of mapped) if (!byId.has(String(m._id || m.id))) byId.set(String(m._id || m.id), m);
      favs = Array.from(byId.values());
    }

    const top5 = favs.slice(0, 5);

    tiles.forEach((el, i) => {
      const rec = top5[i];
      if (!rec) {
        el.style.opacity = "0.25";
        el.style.pointerEvents = "none";
        el.style.backgroundImage = ""; // keep tile shape
        return;
      }
      const img = rec.image || rec.imageUrl || "/Images/default.jpg";
      el.style.backgroundImage = `url('${img}')`;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
      el.style.cursor = "pointer";
      el.onclick = () => openRecipeDetail(rec);
    });
  } catch (e) {
    console.warn("Most Love load failed:", e);
    tiles.forEach(el => { el.style.opacity = "0.25"; el.style.pointerEvents = "none"; });
  }
}

// 2) BEST COLLECTION: one recipe per category → five tiles
async function populateBestCollection() {
  const tiles = [
    document.querySelector("#bestCollection .image-01"),
    document.querySelector("#bestCollection .image-02"),
    document.querySelector("#bestCollection .image-03"),
    document.querySelector("#bestCollection .image-04"),
    document.querySelector("#bestCollection .image-05"),
  ];
  if (tiles.some(t => !t)) return; // grid not present

  // Adjust this mapping to match backend category values
  const categories = ["vegetarian", "non-veg", "healthy", "juices", "dessert"];
  const mapToBackend = { "vegetarian":"veg", "non-veg":"nonveg", "healthy":"salad", "juices":"juices", "dessert":"dessert" };

  function getCat(r) {
    const c = r.category;
    if (!c) return "";
    if (typeof c === "string") return c;
    if (typeof c === "object") return (c.slug || c.name || c.key || "").toString();
    return "";
  }

  try {
    const all = await fetchAllRecipes();

    const picks = categories.map(frontKey => {
      const want = (mapToBackend[frontKey] || "").toLowerCase();
      if (!want) return null;
      const best = all.find(r => getCat(r).toLowerCase() === want && r.isBest === true);
      return best || all.find(r => getCat(r).toLowerCase() === want) || null;
    });

    tiles.forEach((el, i) => {
      const rec = picks[i];
      if (!rec) {
        el.style.opacity = "0.25";
        el.style.pointerEvents = "none";
        el.style.backgroundImage = "";
        return;
      }
      const img = rec.image || rec.imageUrl || "/Images/default.jpg";
      el.style.backgroundImage = `url('${img}')`;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
      el.style.cursor = "pointer";
      el.onclick = () => openRecipeDetail(rec);
    });
  } catch (e) {
    console.warn("Best Collection load failed:", e);
    tiles.forEach(el => { el.style.opacity = "0.25"; el.style.pointerEvents = "none"; });
  }
}

// Run both after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  populateMostLove();
  populateBestCollection();
});
