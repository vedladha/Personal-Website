// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

// Smooth scroll for internal nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      target.scrollIntoView();
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Close mobile nav after navigation
    if (navLinks) {
      navLinks.classList.remove("open");
    }
  });
});

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Close mobile nav on resize to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 720 && navLinks && navToggle) {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// Dynamic year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Projects: show first 3 + "See more" overlay
(function initProjectsToggle() {
  const wrapper = document.getElementById("projects-wrapper");
  const grid = document.getElementById("projects-grid");
  const more = document.getElementById("projects-more");
  const btn = document.getElementById("toggle-projects");

  // If the HTML isn't updated yet, do nothing.
  if (!wrapper || !grid || !more || !btn) return;

  const cards = grid.querySelectorAll(".project-card");

  // If 3 or fewer projects, hide the control entirely
  if (cards.length <= 3) {
    more.style.display = "none";
    wrapper.classList.remove("projects-collapsed");
    wrapper.classList.add("projects-expanded");
    btn.setAttribute("aria-expanded", "true");
    return;
  }

  // Start collapsed by default
  wrapper.classList.add("projects-collapsed");
  wrapper.classList.remove("projects-expanded");
  btn.setAttribute("aria-expanded", "false");
  btn.textContent = "See more projects";

  btn.addEventListener("click", () => {
    const isExpanded = wrapper.classList.contains("projects-expanded");

    if (isExpanded) {
      wrapper.classList.add("projects-collapsed");
      wrapper.classList.remove("projects-expanded");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "See more projects";
    } else {
      wrapper.classList.add("projects-expanded");
      wrapper.classList.remove("projects-collapsed");
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = "Show fewer";
    }
  });
})();

// Contact form submission with FormSubmit
(function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const formStatus = document.getElementById("form-status");

  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      showStatus("Please fill in all fields.", "error");
      return;
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    if (formStatus) {
      formStatus.textContent = "";
      formStatus.className = "form-note";
    }

    // FormSubmit will handle the submission.
    // We show a message before the redirect happens.
    showStatus("Sending your message...", "success");
  });

  function showStatus(text, type) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = `form-note form-status-${type}`;
  }

  // Check if we're returning from FormSubmit (success page)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("success") === "true") {
    if (formStatus) {
      formStatus.textContent =
        "Message sent successfully! I'll get back to you soon.";
      formStatus.className = "form-note form-status-success";
    }

    // Reset button if present
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  }
})();
