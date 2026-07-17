import { loadPets, createCards, initModal, initBurger } from "./common.js";

initBurger();

const prevBtn = document.querySelector(".pets__buttons_left");
const nextBtn = document.querySelector(".pets__buttons_right");
const sliderTrack = document.querySelector(".pets__cards_slider");

let pets = [];
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
    (pet) => !currentPets.some((currentPet) => currentPet.id === pet.id),
  );

  return shuffle(availablePets).slice(0, getCardsCount());
}

function renderCarousel(petsArray) {
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
      renderCarousel(currentPets);

      sliderTrack.classList.remove("animate-left", "animate-right");
      isAnimating = false;
    },
    { once: true },
  );
}

async function initMainPage() {
  pets = await loadPets();

  if (!sliderTrack || !prevBtn || !nextBtn) return;

  currentPets = getInitPets();
  renderCarousel(currentPets);
  initModal(sliderTrack, pets);

  prevBtn.addEventListener("click", () => slide("prev"));
  nextBtn.addEventListener("click", () => slide("next"));
}

initMainPage().catch(console.error);

let cardsCount = getCardsCount();

window.addEventListener("resize", () => {
  if (!sliderTrack || pets.length === 0) return;

  const newCardsCount = getCardsCount();

  if (newCardsCount === cardsCount) return;

  cardsCount = newCardsCount;
  currentPets = getInitPets();
  renderCarousel(currentPets);
});
