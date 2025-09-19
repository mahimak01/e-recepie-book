// Navbar shrink on scroll (keep)
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('shrink');
  else navbar.classList.remove('shrink');
});

// Active nav + back button (keep)
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  const menuLinks = document.querySelectorAll("#menuItem a");
  menuLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  });

  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "homePage.html";
    });
  }
});

// Favorites render
document.addEventListener("DOMContentLoaded", () => {
  const favGrid = document.getElementById("favGrid");

  let favorites = [];
  try { favorites = JSON.parse(localStorage.getItem("favorites")) || []; }
  catch { favorites = []; } // safe parse best practice [9][19]

  if (!Array.isArray(favorites) || favorites.length === 0) {
    favGrid.innerHTML = "<p class='text-center'>No favorites yet!</p>";
    return;
  }

  const frag = document.createDocumentFragment();
  favorites.forEach(fav => {
    const div = document.createElement("div");
    div.className = "col-md-4 mb-4";
    div.innerHTML = `
      <div class="recipe-card position-relative rounded-3" data-id="${fav.id || ""}">
        <img src="${fav.image || "/Images/default.jpg"}" alt="${fav.title || "Recipe"}" class="img-fluid">
        <div class="recipe-overlay">
          <div class="recipe-time">${fav.time || "N/A"}</div>
          <div class="recipe-title fw-bold lh-1.2 fs-5">${fav.title || "Unnamed"}</div>
        </div>
      </div>
    `;
    frag.appendChild(div);
  });
  favGrid.innerHTML = "";
  favGrid.appendChild(frag);

  // Card → detail
  favGrid.addEventListener("click", (e) => {
   const card = e.target.closest(".recipe-card");
if (!card) return;
const id = card.getAttribute("data-id");
if (id) {
  window.location.href = `method.html?id=${encodeURIComponent(id)}`; // deep link[3]
}

  });
});
