/* =========================================================
   INITIALISATION
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initLanguageRedirect();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initModals();
  initRevealAnimations();
  initContactForm();
});

/* =========================================================
   GESTION DE LA LANGUE (Redirection)
========================================================= */
// function initLanguageRedirect() {
//   const currentPath = window.location.pathname;
INITIALISATION;
//   // Si on est sur la page française (index.html ou racine)
//   if (currentPath.endsWith("/") || currentPath.includes("index.html")) {
//     const savedLang = localStorage.getItem("preferredLang");
//     if (savedLang === "ar") window.location.href = "index-ar.html";
//     if (savedLang === "en") window.location.href = "index-en.html";
//   }
// }

function initLanguageRedirect() {
  const currentPath = window.location.pathname;
  const savedLang = localStorage.getItem("preferredLang");

  // 1. Si on est sur la page Française
  if (currentPath.endsWith("/") || currentPath.includes("index.html")) {
    if (savedLang === "ar") window.location.href = "index-ar.html";
    if (savedLang === "en") window.location.href = "index-en.html";
  }

  // 2. Si on est sur la page Arabe
  if (currentPath.includes("index-ar.html")) {
    if (savedLang === "fr") window.location.href = "index.html";
    if (savedLang === "en") window.location.href = "index-en.html";
  }

  // 3. Si on est sur la page Anglaise
  if (currentPath.includes("index-en.html")) {
    if (savedLang === "fr") window.location.href = "index.html";
    if (savedLang === "ar") window.location.href = "index-ar.html";
  }
}

/* =========================================================
   HEADER : Changement au scroll
========================================================= */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =========================================================
   MENU MOBILE
========================================================= */
function initMobileMenu() {
  const btn = document.getElementById("mobileMenuBtn");
  const nav = document.querySelector(".nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("active");
    const icon = btn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    }
  });

  document.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      const icon = btn.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove("active");
      const icon = btn.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      }
    }
  });
}

/* =========================================================
   SMOOTH SCROLL
========================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition =
          target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    });
  });
}

/* =========================================================
   MODALES
========================================================= */
function initModals() {
  const triggers = document.querySelectorAll("[data-modal]");
  const modals = document.querySelectorAll(".modal");
  const closeButtons = document.querySelectorAll(".modal-close");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = "modal-" + trigger.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) closeModal(modal);
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.classList.contains("active")) closeModal(modal);
      });
    }
  });

  document.querySelectorAll(".modal-btn-rdv").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) closeModal(modal);
    });
  });
}

function closeModal(modal) {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

/* =========================================================
   ANIMATIONS AU SCROLL
========================================================= */
function initRevealAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));
}

/* =========================================================
   FORMULAIRE CONTACT (EmailJS) + MESSAGES
========================================================= */
function initContactForm() {
  // ⚠️ Vos identifiants EmailJS
  const PUBLIC_KEY = "tPvo3OTMw4SfvFXWw";
  const SERVICE_ID = "service_71lfzb6";
  const TEMPLATE_ID = "template_pxgumpf";

  const form = document.getElementById("contactForm");
  if (!form) return;

  // Initialisation d'EmailJS
  if (typeof emailjs !== "undefined") {
    emailjs.init(PUBLIC_KEY);
  }

  const submitBtn = document.getElementById("submitBtn");
  const statusEl = document.getElementById("formStatus");
  const originalBtnHTML = submitBtn.innerHTML;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validation basique des champs
    const name = form.user_name.value.trim();
    const phone = form.user_phone.value.trim();
    const message = form.message.value.trim();

    if (!name || !phone || !message) {
      showStatus(
        statusEl,
        "Veuillez remplir tous les champs obligatoires.",
        "error",
      );
      return;
    }

    // État de chargement
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    showStatus(statusEl, "", ""); // Efface l'ancien message

    // Envoi via EmailJS
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, this)
      .then(() => {
        // ✅ SUCCÈS
        showStatus(
          statusEl,
          "✓ Votre message a bien été envoyé. Nous vous contacterons très prochainement.",
          "success",
        );
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      })
      .catch((error) => {
        // ❌ ERREUR
        console.error("Erreur EmailJS:", error);
        showStatus(
          statusEl,
          "Une erreur est survenue. Merci de nous contacter par téléphone ou WhatsApp.",
          "error",
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      });
  });
}

function showStatus(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = "form-status" + (type ? " " + type : "");
}
