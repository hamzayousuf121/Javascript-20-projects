const resultsNav = document.getElementById('resultsNav');
const resultsContainer = document.getElementById('results');
const favoritesNav = document.getElementById('favoritesNav');
const favoritesContainer = document.getElementById('favorites');
const saveConfirmed = document.getElementById('saveConfirmed');
const loader = document.getElementById('loader');

// NASA API
const count = 10;
const apiKey = 'hHt592uvYa5AKdj9zIGFy4UoOLvHCVQsJh2xmRdL';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

// Initialize two empty arrays
let resultsArray = [];
let favoritesArray = [];

// Hide Favorites Navigation & Save Confirmation
favoritesNav.style.display = 'none';
saveConfirmed.style.display = 'none';

// Show Loader on Startup
loader.style.display = 'flex';
resultsNav.style.display = 'none';
favoritesNav.style.display = 'none';

// Get 10 images from NASA API
async function getNasaPictures() {
  loader.style.display = 'flex';
  resultsNav.style.display = 'none';
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateResultsDOM();
  } catch (error) {
    // Catch Error Here
  }
}

// Create individual result elements, adds elements when getting more pictures
function updateResultsDOM() {
  // Loop through Results Array to replace undefined copyright
  console.log('Results Array:', resultsArray);
  for (let i = 0; i < resultsArray.length; i++) {
    if (resultsArray[i].copyright === undefined) {
      resultsArray[i].copyright = '';
      // console.log(resultsArray[i].copyright);
    }
  }
  resultsContainer.innerHTML = resultsArray
    .map(
      (result) => `
        <div class="card">
            <a href="${result.hdurl}" title="View Full Image" target="blank" rel="noopener noreferrer">
            <img class="card-img-top" src="${result.url}" alt="NASA Picture of the Day" loading="lazy">
            </a>      
            <div class="card-body">
            <h5 class="card-title">${result.title}</h5>
            <p class="save-text" onclick="saveFavorite('${result.url}')" id="favoriteLabel">Add To Favorites</p>
            <p class="card-text">${result.explanation}</p>
            <p class="card-text"><small class="text-muted">
                <strong>${result.date}</strong>
                <span>${result.copyright}</span>
            </small></p>
            </div>
        </div>
        `,
    )
    .join('');
  window.scrollTo(0, -5000);
  // Remove loader, add navigation
  setTimeout(() => {
    loader.style.display = 'none';
    resultsNav.style.display = 'flex';
  }, 500);
}

// Creates elements for favorite items in array
function updateFavoritesDOM() {
  // Get Favorites Array from localStorage
  if (localStorage.getItem('nasaFavorites') !== null) {
    favoritesArray = JSON.parse(localStorage.getItem('nasaFavorites'));
  }
  // Loop through Results Array to replace undefined copyright
  console.log('Favorites Array:', favoritesArray);
  for (i = 0; i < favoritesArray.length; i++) {
    favoritesArray[i].copyright;
    if (favoritesArray[i].copyright === undefined) {
      favoritesArray[i].copyright = '';
      // console.log(favoritesArray[i].copyright);
    }
  }

  favoritesContainer.innerHTML = favoritesArray
    .map(
      (result) => `
        <div class="card">
            <a href="${result.hdurl}" title="View Full Image" target="blank" rel="noopener noreferrer">
            <img class="card-img-top" src="${result.url}" alt="NASA Picture of the Day" loading="lazy">
            </a>
            <div class="card-body">
            <h5 class="card-title">${result.title}</h5>
            <p class="save-text" onclick="removeFavorite('${result.url}')">Remove Favorite</p>
            <p class="card-text">${result.explanation}</p>
            <p class="card-text"><small class="text-muted">
                <strong>${result.date}</strong>
                <span>${result.copyright}</span>
            </small></p>
            </div>
        </div>
        `,
    )
    .join('');
  // Remove loader, add navigation
  setTimeout(() => {
    loader.style.display = 'none';
    favoritesNav.style.display = 'flex';
  }, 500);
}

// Add result to Favorites Array
function saveFavorite(result) {
  // Get Favorites Array from localStorage
  if (localStorage.getItem('nasaFavorites') !== null) {
    favoritesArray = JSON.parse(localStorage.getItem('nasaFavorites'));
  }

  // Loop through Results Array to select Favorite
  for (i = 0; i < resultsArray.length; i++) {
    if (resultsArray[i].url.includes(result)) {
      const resultMatch = resultsArray[i];
      // console.log(resultMatch);
      favoritesArray.push(resultMatch);
      console.log('Favorites Array:', favoritesArray);

      // Show Save Confirmation for 2 seconds
      saveConfirmed.style.display = 'block';
      setTimeout(() => {
        saveConfirmed.style.display = 'none';
      }, 2000);

      // Set Favorites Array in localStorage
      localStorage.setItem('nasaFavorites', JSON.stringify(favoritesArray));
    }
  }
}

// Remove result from Favorites Array
function removeFavorite(result) {
  for (i = 0; i < favoritesArray.length; i++) {
    if (favoritesArray[i].url.includes(result)) {
      // let favoriteMatch = favoritesArray[i];
      // console.log(favoriteMatch);
      favoritesArray.splice(i, 1);
      console.log('Favorites Array:', favoritesArray);

      // Set Favorites Array in localStorage
      localStorage.setItem('nasaFavorites', JSON.stringify(favoritesArray));
    }
  }
  updateFavoritesDOM();
}

// Show Favorites DOM Elements / Hide Results DOM Elements
function showFavorites() {
  loader.style.display = 'flex';
  favoritesContainer.style.display = 'block';
  favoritesNav.style.display = 'none';
  resultsContainer.style.display = 'none';
  resultsNav.style.display = 'none';

  // Scroll to top of page, refresh DOM
  window.scrollTo(0, -5000);
  updateFavoritesDOM();
}

// Hide Favorites DOM Elements / Show Results DOM Elements
function showResults() {
  loader.style.display = 'flex';
  favoritesContainer.style.display = 'none';
  favoritesNav.style.display = 'none';
  resultsContainer.style.display = 'block';
  resultsNav.style.display = 'flex';

  // Scroll to top of page, refresh DOM
  window.scroll(0, -5000);
  getNasaPictures();
}

// On Load
getNasaPictures();
