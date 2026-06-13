// Burger script
const nav = document.querySelector(".nav, .nav__pets");
const hamburger = document.querySelector(".hamburger");
const body = document.body;
const navLinks = document.querySelectorAll(".nav__link, .pets__link");

if (nav && hamburger) {
  const closeMenu = () => {
    nav.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    body.classList.remove("lock");
  };

  const openMenu = () => {
    nav.classList.add("active");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    body.classList.add("lock");
  };

  hamburger.addEventListener("click", () => {
    if (nav.classList.contains("active")) closeMenu();
    else openMenu();
  });

  navLinks.forEach((link) => {
    ы;
    link.addEventListener("click", (e) => {
      if (link.classList.contains("header__link_active")) {
        e.preventDefault();
      }
      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) {
      closeMenu();
    }
  });
}
