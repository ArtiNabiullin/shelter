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
  renderPetsPage();
}

function prevPage() {
  if (prevButton.classList.contains("disabled")) return;
  if (currentPage <= 1) return;

  currentPage--;
  renderPetsPage();
}

function firstPage() {
  if (prevAllButton.classList.contains("disabled")) return;

  currentPage = 1;
  renderPetsPage();
}

function lastPage() {
  if (nextAllButton.classList.contains("disabled")) return;

  currentPage = getTotalPages();
  renderPetsPage();
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
