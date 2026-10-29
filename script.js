/* =========================================================
   EDIT THIS SECTION FIRST
   Leave a value empty ("") and its button/link stays disabled.
   ========================================================= */
const PORTRAIT = "images/portrait.jpg"; // path to your portrait

const LINKS = {
  github: "",    // e.g. "https://github.com/your-username"
  facebook: "",  // e.g. "https://facebook.com/your-profile"
  linkedin: "",  // e.g. "https://linkedin.com/in/your-profile"
  email: ""      // e.g. "you@example.com"
};
/* ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Portrait ---------- */
if (PORTRAIT) {
  const img = document.getElementById("portraitImg");
  img.src = PORTRAIT;
  img.hidden = false;
  document.getElementById("portraitPlaceholder").hidden = true;
}

/* ---------- Social links (disable when empty) ---------- */
document.querySelectorAll("[data-social]").forEach(a => {
  const key = a.dataset.social;
  const value = LINKS[key];
  if (value) {
    a.href = key === "email" ? "mailto:" + value : value;
    if (key !== "email") { a.target = "_blank"; a.rel = "noopener noreferrer"; }
  } else {
    a.classList.add("off");
    a.setAttribute("aria-disabled", "true");
    a.title = "Add your link in script.js";
  }
});

/* ---------- Project links (hide when empty) ---------- */
document.querySelectorAll(".project").forEach(card => {
  [["gh", "github"], ["demo", "demo"]].forEach(([cls, attr]) => {
    const btn = card.querySelector("." + cls);
    const url = card.dataset[attr];
    if (url) { btn.href = url; btn.target = "_blank"; btn.rel = "noopener noreferrer"; }
    else btn.hidden = true;
  });
});

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

/* ---------- Smooth scrolling ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});
document.getElementById("toTop").addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("in"); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------- Active nav link ---------- */
const navLinks = document.querySelectorAll(".menu a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => sectionObserver.observe(s));

/* ---------- Project filters ---------- */
const chips = document.querySelectorAll(".chip");
chips.forEach(chip => chip.addEventListener("click", () => {
  chips.forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  const filter = chip.dataset.filter;
  document.querySelectorAll(".project").forEach(card => {
    card.classList.toggle("hide", filter !== "all" && card.dataset.category !== filter);
  });
}));

/* ---------- Certificate modal ---------- */
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
let lastFocus = null;

function closeModal() {
  modal.hidden = true;
  modalImg.src = "";
  if (lastFocus) lastFocus.focus();
}
document.querySelectorAll(".cert").forEach(card => {
  const btn = card.querySelector(".view");
  const src = card.dataset.img;
  if (!src) {
    btn.disabled = true;
    btn.title = "Add the image path to data-img in index.html";
    return;
  }
  const thumb = card.querySelector(".thumb");
  thumb.textContent = "";
  const preview = document.createElement("img");
  preview.src = src; preview.alt = ""; thumb.appendChild(preview);
  btn.addEventListener("click", () => {
    lastFocus = btn;
    modalImg.src = src;
    modalImg.alt = card.querySelector("h3").textContent;
    modal.hidden = false;
    modal.querySelector(".close").focus();
  });
});
modal.querySelector(".close").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

/* ---------- Contact form validation ---------- */
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener("submit", e => {
  e.preventDefault();
  let valid = true;
  ["name", "email", "message"].forEach(id => {
    const field = form.elements[id];
    const err = form.querySelector('[data-for="' + id + '"]');
    const value = field.value.trim();
    let msg = "";
    if (!value) msg = "This field is required.";
    else if (id === "email" && !emailPattern.test(value)) msg = "Enter a valid email address.";
    err.textContent = msg;
    if (msg) valid = false;
  });
  status.textContent = valid
    ? "Your details look good, but nothing was sent. This site has no backend. To receive messages, connect a form service (such as Formspree) or a server."
    : "Please fix the errors above.";
});
