document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name && email && message) {
      // Prepare data object
      const contactData = {
        name,
        email,
        message,
        time: new Date().toLocaleString()
      };

      // Retrieve existing messages or create new array
      let storedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
      storedContacts.push(contactData);

      // Save back to localStorage
      localStorage.setItem("contacts", JSON.stringify(storedContacts));

      // Reset form
      form.reset();

      // Show custom toast
      toast.textContent = "Message sent successfully!";
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    } else {
      // Show error toast if validation fails
      toast.textContent = " Please fill all fields!";
      toast.classList.add("show", "error");

      setTimeout(() => {
        toast.classList.remove("show", "error");
      }, 3000);
    }
  });
});

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