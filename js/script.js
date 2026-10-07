/* =========================================================
   INITIALISATION
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initModals();
  initRevealAnimations();
  initContactForm();
});

/* =========================================================
   HEADER : Changement au scroll
========================================================= */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
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

  // Fermer le menu au clic sur un lien
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

  // Fermer au clic extérieur
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
   SMOOTH SCROLL (fallback pour anciens navigateurs)
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

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
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

  // Ouvrir
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

  // Fermer via bouton
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) closeModal(modal);
    });
  });

  // Fermer via clic extérieur
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Fermer via touche Échap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.classList.contains("active")) closeModal(modal);
      });
    }
  });

  // Bouton "Prendre RDV" dans la modale
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
   ANIMATIONS AU SCROLL (Reveal)
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
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  reveals.forEach((el) => observer.observe(el));
}

/* =========================================================
   FORMULAIRE CONTACT (EmailJS)
========================================================= */
function initContactForm() {
  // ⚠️ IMPORTANT : Remplacez ces valeurs par vos identifiants EmailJS
  // 1. Créez un compte sur https://www.emailjs.com/
  // 2. Ajoutez un service (Gmail) et un template
  // 3. Récupérez votre Public Key dans Account > API Keys
  const PUBLIC_KEY = "VOTRE_PUBLIC_KEY_ICI";
  const SERVICE_ID = "VOTRE_SERVICE_ID_ICI";
  const TEMPLATE_ID = "VOTRE_TEMPLATE_ID_ICI";

  const form = document.getElementById("contactForm");
  if (!form) return;

  // Initialisation EmailJS
  if (typeof emailjs !== "undefined") {
    emailjs.init(PUBLIC_KEY);
  }

  const submitBtn = document.getElementById("submitBtn");
  const statusEl = document.getElementById("formStatus");
  const originalBtnHTML = submitBtn.innerHTML;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validation basique
    const name = form.user_name.value.trim();
    const phone = form.user_phone.value.trim();
    const email = form.user_email.value.trim();
    const message = form.message.value.trim();

    if (!name || !phone || !email || !message) {
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
    showStatus(statusEl, "", "");

    // Envoi via EmailJS
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, this)
      .then(() => {
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
