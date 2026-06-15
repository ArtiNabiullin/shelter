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
    link.addEventListener("click", (e) => {
      if (link.classList.contains("header__link_active")) {
        e.preventDefault();
      }
      closeMenu();
    });
  });

  nav.addEventListener("click", (e) => {
    if (e.target === nav) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) {
      closeMenu();
    }
  });
}

//pets.json
let pets = [];

async function loadPets() {
  const response = await fetch("./json/pets.json");

  if (!response.ok) {
    throw new Error("Не удалось загрузить pets.json");
  }

  pets = await response.json();

  pets = pets.map((pet, index) => ({
    id: index + 1,
    ...pet,
  }));

  return pets;
}

// Carousel script

const prevBtn = document.querySelector(".pets__buttons_left");
const nextBtn = document.querySelector(".pets__buttons_right");
const sliderTrack = document.querySelector(".pets__cards");
const currentSlide = document.querySelector(".current");
const nextSlide = document.querySelector(".next");

let currentPets = [];
let isAnimating = false;

function getCardsCount() {
  if (window.innerWidth >= 1280) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getInitPets() {
  return shuffle(pets).slice(0, getCardsCount());
}

function getNextPets() {
  const availablePets = pets.filter(
    (pet) => !currentPets.some((curr) => curr.id === pet.id),
  );
  return shuffle(availablePets).slice(0, getCardsCount());
}

function createCards(petsArray) {
  return petsArray
    .map(
      (pet) => `
    <div class="pets__card">
          <img
            class="pets__card_image"
            src="${pet.img}"
            alt="${pet.name}"
          >

          <h3 class="pets__cards_desc">
            ${pet.name}
          </h3>

          <a class="pets__link">
            Learn more
          </a>
    </div>
    `,
    )
    .join("");
}

//отрисовка

function render(petsArray) {
  sliderTrack.innerHTML = createCards(petsArray);
}

function slide(direction) {
  if (isAnimating) return;

  isAnimating = true;

  sliderTrack.classList.add(
    direction === "next" ? "animate-left" : "animate-right",
  );

  sliderTrack.addEventListener(
    "transitionend",
    () => {
      currentPets = getNextPets();

      render(currentPets);

      sliderTrack.classList.remove("animate-left", "animate-right");

      isAnimating = false;
    },
    { once: true },
  );
}

prevBtn.addEventListener("click", () => slide("prev"));
nextBtn.addEventListener("click", () => slide("next"));

async function init() {
  try {
    await loadPets();

    currentPets = getInitPets();
    render(currentPets);
  } catch (error) {
    console.error(error);
  }
}

init();

let cardsCount = getCardsCount();

window.addEventListener("resize", () => {
  const newCount = getCardsCount();

  if (newCount !== cardsCount) {
    cardsCount = newCount;

    currentPets = getInitPets();
    render(currentPets);
  }
});
