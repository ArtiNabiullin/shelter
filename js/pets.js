import { loadPets, createCards, initModal, initBurger } from "./common.js";

initBurger();

const petsContainer = document.querySelector(".pets__cards_catalog");

const prevButton = document.querySelector(".animals__button_left");
const prevAllButton = document.querySelector(".animals__button_left-all");
const nextButton = document.querySelector(".animals__button_right");
const nextAllButton = document.querySelector(".animals__button_right-all");
const pageIndicator = document.querySelector(".page__indicator");

let pets = [];
let finalPetsList = [];
let cardsPerPage = getCardsPetsCount();
let currentPage = 1;
let isAnimating = false;

function shuffle(list) {
  const copy = [...list];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getCardsPetsCount() {
  if (window.innerWidth >= 1280) return 8;
  if (window.innerWidth >= 768) return 6;
  return 3;
}

function getTotalPages() {
  return Math.ceil(finalPetsList.length / cardsPerPage);
}

function getCurrentPets() {
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  return finalPetsList.slice(startIndex, endIndex);
}

function renderPetsPage() {
  petsContainer.innerHTML = createCards(getCurrentPets());

  pageIndicator.textContent = `${currentPage} / ${getTotalPages()}`;

  updateButtonsState();
}

function changePage(direction) {
  if (isAnimating) return;

  isAnimating = true;

  const outClass = direction === "next" ? "slide-left-out" : "slide-right-out";

  const inClass = direction === "next" ? "slide-left-in" : "slide-right-in";

  petsContainer.classList.add(outClass);

  petsContainer.addEventListener(
    "animationend",
    () => {
      petsContainer.classList.remove(outClass);

      renderPetsPage();

      petsContainer.classList.add(inClass);

      petsContainer.addEventListener(
        "animationend",
        () => {
          petsContainer.classList.remove(inClass);
          isAnimating = false;
        },
        { once: true },
      );
    },
    { once: true },
  );
}

function updateButtonsState() {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === getTotalPages();

  prevButton.classList.toggle("disabled", isFirstPage);
  prevAllButton.classList.toggle("disabled", isFirstPage);
  nextButton.classList.toggle("disabled", isLastPage);
  nextAllButton.classList.toggle("disabled", isLastPage);
}

function nextPage() {
  if (nextButton.classList.contains("disabled")) return;
  if (currentPage >= getTotalPages()) return;

  currentPage++;
  changePage("next");
}

function prevPage() {
  if (prevButton.classList.contains("disabled")) return;
  if (currentPage <= 1) return;

  currentPage--;
  changePage("prev");
}

function firstPage() {
  if (prevAllButton.classList.contains("disabled")) return;

  currentPage = 1;
  changePage("prev");
}

function lastPage() {
  if (nextAllButton.classList.contains("disabled")) return;

  currentPage = getTotalPages();
  changePage("next");
}

async function initPetsPage() {
  pets = await loadPets();

  if (
    !petsContainer ||
    !prevButton ||
    !prevAllButton ||
    !nextButton ||
    !nextAllButton ||
    !pageIndicator
  ) {
    return;
  }

  finalPetsList = createPaginationList(pets);

  renderPetsPage();
  initModal(petsContainer, pets);

  nextButton.addEventListener("click", nextPage);
  prevButton.addEventListener("click", prevPage);
  prevAllButton.addEventListener("click", firstPage);
  nextAllButton.addEventListener("click", lastPage);

  window.addEventListener("resize", () => {
    const newCardsPerPage = getCardsPetsCount();

    if (newCardsPerPage === cardsPerPage) return;

    cardsPerPage = newCardsPerPage;

    if (currentPage > getTotalPages()) {
      currentPage = getTotalPages();
    }

    renderPetsPage();
  });
}

initPetsPage().catch(console.error);

function hasAdjacentDuplicates(list) {
  return list.some((pet, index) => {
    if (index === 0) return false;

    return pet.id === list[index - 1].id;
  });
}

function createPaginationList(petsArray) {
  let result;

  do {
    result = shuffle([
      ...petsArray,
      ...petsArray,
      ...petsArray,
      ...petsArray,
      ...petsArray,
      ...petsArray,
    ]);
  } while (hasAdjacentDuplicates(result));

  return result;
}
