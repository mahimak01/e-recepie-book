const hero = document.querySelector('.hero');
const heroImg = document.querySelector('.hero-img');
//for image movement
hero.addEventListener('mousemove', (e) => {
  const { offsetWidth, offsetHeight } = hero;
  const x = e.offsetX - offsetWidth / 5;   
  const y = e.offsetY - offsetHeight / 5;  

  const rotateX = (y / offsetHeight) * 60;
  const rotateY = (x / offsetWidth) * -60; 

  heroImg.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

hero.addEventListener('mouseleave', () => {
  // Reset 
  heroImg.style.transform = "rotateX(0deg) rotateY(0deg)";
});
const feedbackBtn = document.getElementById("feedbackBtn");
const feedbackForm = document.getElementById("feedbackForm");
const closeForm = document.getElementById("closeForm");
const feedbackDataForm = document.getElementById("feedbackDataForm");
const toast = document.getElementById("toast");

// feedback form
feedbackBtn.addEventListener("click", () => {
  feedbackForm.style.display = "flex";
});

closeForm.addEventListener("click", () => {
  feedbackForm.style.display = "none";
});

feedbackForm.addEventListener("click", (e) => {
  if (e.target === feedbackForm) {
    feedbackForm.style.display = "none";
  }
});

feedbackDataForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const recipeChoice = document.querySelector('input[name="recipe"]:checked').value;
  const suggestion = document.getElementById("suggestion").value;

  const feedback = {
    recipeChoice,
    suggestion,
    date: new Date().toLocaleString()
  };

  let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
  feedbackList.push(feedback);
  localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

  feedbackDataForm.reset();

  feedbackForm.style.display = "none";
  showToast("Thank you for your feedback!");
});

// Toast function
function showToast(message) {
  toast.innerText = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}
//active page
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