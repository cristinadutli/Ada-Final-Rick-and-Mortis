const container = document.getElementById("container")
const firstPageBtn = document.getElementById("firstPage");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const lastPageBtn = document.getElementById("lastPage");
const totalCharactersSpan = document.getElementById("totalCharacters");
const genderFilterSelect = document.getElementById("genderFilter");
const selectedCard = document.querySelector('.card.selected');
const currentPageSpan = document.getElementById("currentPageInfo");


let currentPage = 1;
let totalPages = 42;
let currentGenderFilter = "all";

const updatePageInfo = () => {
  currentPageSpan.textContent = `Página ${currentPage} de ${totalPages}`;
};

const renderCharacters = (characters) => {
  container.innerHTML = "";
  characters.forEach((character) => {
    container.innerHTML += `
            <div class="card">
              <h2>${character.name}</h2>
              <div class="imag">
                <img src="${character.image}" alt="${character.name}">
              </div>
              <div class="botom-ver"> 
                <button class="botom" onclick="verDescription('${character.url}')">Ver más</button>
              </div>
            </div>
          `;
  });
};
const verDescription = (characterUrl) => {
  if (selectedCard) {
    selectedCard.classList.remove('selected');
  }
  fetch(characterUrl)
    .then((res) => res.json())
    .then((character) => {
      container.innerHTML = `
            <div class="card description-card">
                <h2>${character.name}</h2>
                <div class="imag">
                  <img src="${character.image}" alt="${character.name}">
                </div>
                <div class="character-details">
                  <p>Status: ${character.status}</p>
                  <p>Especie: ${character.species}</p>
                  <p>Origen: ${character.origin.name}</p>
                  <p>Episode: ${character.episode.length}</p>
                </div>
                <div class="botom-ver"> 
                <button class="botom" onclick="returnCharacters()">Volver</button>
                
                </div>
              </div>
            `;
    });
};
const returnCharacters = () => {
  getCharacters(currentPage, currentGenderFilter)
}

const updateButtons = () => {
  firstPageBtn.disabled = currentPage === 1;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
  lastPageBtn.disabled = currentPage === totalPages;
};

const getCharacters = (pageNumber, genderFilter) => {
  container.innerHTML = "";

  if (genderFilter && genderFilter !== "all") {
    genderFilter = `&gender=${genderFilter}`;
  }
  else {
    genderFilter = "";
  }
  fetch(`https://rickandmortyapi.com/api/character/?page=${pageNumber}${genderFilter}`)
    .then(res => res.json())
    .then((data) => {
      totalPages = data.info.pages;
      totalCharactersSpan.textContent = data.info.count;
      renderCharacters(data.results);
      updateButtons();
      updatePageInfo()
    })
}
firstPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage = 1;
    getCharacters(currentPage, currentGenderFilter);
  }
});
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getCharacters(currentPage, currentGenderFilter);
  }
});
nextPageBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    getCharacters(currentPage, currentGenderFilter);
  }
});
lastPageBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage = totalPages;
    getCharacters(currentPage, currentGenderFilter);
  }
});
genderFilterSelect.addEventListener("change", () => {
  currentGenderFilter = genderFilterSelect.value;
  getCharacters(currentPage, currentGenderFilter)
});

getCharacters(currentPage, currentGenderFilter);
updatePageInfo();   