// ===================== BACK BUTTON =====================
const backBtn = document.getElementById("backBtn");
backBtn?.addEventListener("click", () => {
  if (window.history.length > 1) window.history.back();
  else window.location.href = "homePage.html";
});

// ===================== FEEDBACK FORM =====================
const feedbackBtn = document.getElementById("feedbackBtn");
const feedbackForm = document.getElementById("feedbackForm");
const closeForm = document.getElementById("closeForm");
const feedbackDataForm = document.getElementById("feedbackDataForm");
const toast = document.getElementById("toast");

if (feedbackBtn) {
  feedbackBtn.addEventListener("click", () => (feedbackForm.style.display = "flex"));
  closeForm.addEventListener("click", () => (feedbackForm.style.display = "none"));
  feedbackForm.addEventListener("click", (e) => {
    if (e.target === feedbackForm) feedbackForm.style.display = "none";
  });

  feedbackDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const recipeChoice = document.querySelector('input[name="recipe"]:checked')?.value || "No";
    const suggestion = document.getElementById("suggestion").value || "";

    const feedback = {
      recipeChoice,
      suggestion,
      date: new Date().toLocaleString(),
    };

    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    feedbackList.push(feedback);
    localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

    feedbackDataForm.reset();
    feedbackForm.style.display = "none";
    showToast("Thank you for your feedback!");
  });
}

function showToast(message) {
  toast.innerText = message;
  toast.className = "show";
  setTimeout(() => (toast.className = toast.className.replace("show", "")), 3000);
}

// ===================== RECIPE DETAILS =====================
document.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL = "http://localhost:3000";
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let recipe = null;

  // Fetch recipe from backend
  if (id) {
    try {
      const res = await fetch(`${BASE_URL}/api/recipes/${encodeURIComponent(id)}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      recipe = await res.json();
    } catch (err) {
      console.error("Detail fetch error:", err);
      alert("Could not load recipe by id, trying saved selection...");
    }
  }

  // Fallback to localStorage
  if (!recipe) {
    try {
      recipe = JSON.parse(localStorage.getItem("selectedRecipe"));
    } catch {
      recipe = null;
    }
  }

  if (!recipe) {
    alert("No recipe found. Please search again.");
    window.location.href = "homePage.html";
    return;
  }

  // ===================== HERO =====================
  const heroImg = document.querySelector(".hero-img");
  const heroTitle = document.querySelector(".hero-content h2");
  const heroDesc = document.querySelector(".hero-content p");
  const heroInfo = document.querySelector(".recipe-info");

  if (heroImg) {
    heroImg.src = recipe.image || recipe.imageUrl || "/Images/default.jpg";
    heroImg.style.width = "100%";
    heroImg.style.height = "100%";
    heroImg.style.objectFit = "cover";
  }
  if (heroTitle) heroTitle.textContent = recipe.name || "Recipe Name";
  if (heroDesc) heroDesc.textContent = recipe.description || "Delicious recipe.";
  if (heroInfo) {
    heroInfo.innerHTML = `
      <div class="px-2 py-1 rounded-3 text-white">🍴 Category: ${recipe.category?.name || recipe.category || "N/A"}</div>
      <div class="px-2 py-1 rounded-3 text-white">⏰ Time: ${recipe.time || "N/A"}</div>
      ${recipe.calories ? `<div class="px-2 py-1 rounded-3 text-white">🔥 Calories: ${recipe.calories}</div>` : ""}
    `;
  }

  // ===================== INGREDIENTS =====================
  const ingList = document.querySelector(".ingredients ul");
  if (ingList && Array.isArray(recipe.ingredients)) {
    ingList.innerHTML = recipe.ingredients.map((ing) => `<li class="py-2">${ing}</li>`).join("");
  }

  // ===================== INSTRUCTIONS =====================
  const instrDiv = document.querySelector(".instructions");
  if (instrDiv && Array.isArray(recipe.steps)) {
    instrDiv.innerHTML = `
      <h3 class="instructionhead mb-4">Instructions</h3>
      ${recipe.steps.map((s, i) => `<p><strong>Step ${i + 1}:</strong> ${s}</p>`).join("")}
    `;
  }

  // ===================== NEEDED / REQUIREMENTS =====================
  const needList = document.querySelector(".need ul");
  const reqArray = recipe.requirements || recipe.requirement || [];
  if (needList) {
    if (reqArray.length > 0) {
      needList.innerHTML = reqArray.map((req) => `<li> ${req}</li>`).join("");
    } else {
      needList.innerHTML = "<li>No special equipment needed</li>";
    }
  }
});
