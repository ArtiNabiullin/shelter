export let pets = [];

export async function loadPets() {
  const response = await fetch("./json/pets.json");

  if (!response.ok) {
    throw new Error("Не удалось загрузить pets.json");
  }

  const data = await response.json();

  pets = data.map((pet, index) => ({
    id: index + 1,
    ...pet,
  }));

  return pets;
}

export function createCards(petsArray) {
  return petsArray
    .map(
      (pet) => `
        <div class="pets__card" data-pet-id="${pet.id}">
          <img class="pets__card_image" src="${pet.img}" alt="${pet.name}">
          <h3 class="pets__cards_desc">${pet.name}</h3>
          <a class="pets__link">Learn more</a>
        </div>
      `,
    )
    .join("");
}

export function initModal(container, petsArray) {
  const dialog = document.getElementById("modal");
  const closeDialog = document.getElementById("close__modal");
  const modalContent = document.getElementById("modal__content");

  if (!container || !dialog || !closeDialog || !modalContent) return;

  container.addEventListener("click", (event) => {
    const card = event.target.closest(".pets__card");

    if (!card) return;

    const petId = Number(card.dataset.petId);
    const pet = petsArray.find((item) => item.id === petId);

    if (!pet) return;

    modalContent.innerHTML = createCardModal(pet);
    dialog.showModal();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  closeDialog.addEventListener("click", () => {
    dialog.close();
  });
}

function createCardModal(pet) {
  return `
    <div class="pets__card-modal">
      <img class="pets__card-modal_image" src="${pet.img}" alt="${pet.name}">
      <div class="pets__card-modal_block">
        <div class="pets__card-modal_title">
          <h3 class="pets__card-modal_desc">${pet.name}</h3>
          <h4 class="type-breed">${pet.type} - ${pet.breed}</h4>
        </div>

        <div class="pets__card-modal_description">
          ${pet.description}
        </div>

        <ul class="pets__card-modal_info">
          <li><strong>Age:</strong> ${pet.age}</li>
          <li><strong>Inoculations:</strong> ${pet.inoculations}</li>
          <li><strong>Diseases:</strong> ${pet.diseases}</li>
          <li><strong>Parasites:</strong> ${pet.parasites}</li>
        </ul>
      </div>
    </div>
  `;
}

export function initBurger() {
  const nav = document.querySelector(".nav, .nav__pets");
  const hamburger = document.querySelector(".hamburger");
  const body = document.body;
  const navLinks = document.querySelectorAll(".nav__link, .pets__link");

  if (!nav || !hamburger) return;

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
    if (nav.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) {
      closeMenu();
    }
  });
}
