const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const themeSwitch = document.querySelector(".theme-switch");
const root = document.documentElement;

function updateFavicon(theme) {
  if (typeof window.updateThemeFavicon === "function") {
    window.updateThemeFavicon(theme);
    return;
  }

  const icon = document.getElementById("favicon");
  if (!icon || !icon.parentNode) return;

  const href = theme === "dark" ? "favicon.ico" : "favicon2.ico";
  const nextIcon = icon.cloneNode(false);
  nextIcon.setAttribute("href", `${href}?theme=${theme}`);
  icon.parentNode.replaceChild(nextIcon, icon);
}

function getTheme() {
  return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateFavicon(theme);
  if (themeSwitch) {
    const isDark = theme === "dark";
    const label = isDark ? "Switch to light mode" : "Switch to dark mode";
    themeSwitch.setAttribute("aria-checked", String(isDark));
    themeSwitch.setAttribute("aria-label", label);
    themeSwitch.setAttribute("title", label);
  }
}

if (themeSwitch) {
  themeSwitch.addEventListener("click", () => {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });
  setTheme(getTheme());
}

const MOBILE_NAV_QUERY = "(max-width: 768px)";

function closeMobileNav() {
  if (!navLinks || !menuToggle) return;
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen && window.matchMedia(MOBILE_NAV_QUERY).matches);
  });

  window.addEventListener("resize", () => {
    if (!window.matchMedia(MOBILE_NAV_QUERY).matches) {
      closeMobileNav();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileNav();
  });
}

navAnchors.forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

const sections = document.querySelectorAll("main section[id]");

if (sections.length && navAnchors.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");
        navAnchors.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("active", isActive);
          if (isActive) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));
}
