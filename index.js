const API_URL = "https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,cca3,languages,currencies,timezones,maps";

const countryList = document.getElementById("countryList");
const statusEl = document.getElementById("status");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("regionFilter");

// Modal elements
let modal, modalContent;

let countries = [];
let filtered = [];

// Create modal in DOM
function createModal() {
  modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <div id="modalDetails"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // Close modal on click
  modal.querySelector(".close-btn").addEventListener("click", () => {
    modal.style.display = "none";
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  modalContent = document.getElementById("modalDetails");
}

// Load countries
async function loadCountries() {
  try {
    statusEl.textContent = "Loading...";
    const res = await axios.get(API_URL);
    countries = res.data;
    filtered = countries;
    renderCountries();
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = "Error loading countries.";
    console.error(err);
  }
}

// Render country cards
function renderCountries() {
  countryList.innerHTML = "";
  if (filtered.length === 0) {
    statusEl.textContent = "Not found";
    return;
  }
  statusEl.textContent = "";

  filtered.forEach(c => {
    const li = document.createElement("li");
    li.className = "country-card";

    li.innerHTML = `
      <img src="${c.flags.png}" alt="Flag of ${c.name.common}">
      <h3>${c.name.common}</h3>
      <p><strong>Region:</strong> ${c.region}</p>
      <p><strong>Population:</strong> ${c.population.toLocaleString()}</p>
      <button>View Details</button>
    `;

    // Button event
    li.querySelector("button").addEventListener("click", () => showDetails(c));

    countryList.appendChild(li);
  });
}

// Apply filters
function applyFilters() {
  const query = searchInput.value.toLowerCase();
  const region = regionFilter.value;

  filtered = countries.filter(c => {
    const matchesRegion = region === "all" || c.region === region;
    const matchesQuery = c.name.common.toLowerCase().includes(query);
    return matchesRegion && matchesQuery;
  });

  renderCountries();
}

// Show details in modal
function showDetails(c) {
  modalContent.innerHTML = `
    <h2>${c.name.common}</h2>
    <img src="${c.flags.svg}" alt="Flag of ${c.name.common}">
    <p><strong>Capital:</strong> ${c.capital ? c.capital.join(", ") : "N/A"}</p>
    <p><strong>Languages:</strong> ${c.languages ? Object.values(c.languages).join(", ") : "N/A"}</p>
    <p><strong>Currencies:</strong> ${
      c.currencies
        ? Object.values(c.currencies).map(cur => `${cur.name} (${cur.symbol})`).join(", ")
        : "N/A"
    }</p>
    <p><strong>Timezones:</strong> ${c.timezones ? c.timezones.join(", ") : "N/A"}</p>
    <p><a href="${c.maps.googleMaps}" target="_blank">View on Google Maps</a></p>
  `;
  modal.style.display = "flex";
}

// Attach events
searchInput.addEventListener("input", applyFilters);
regionFilter.addEventListener("change", applyFilters);

// Init
createModal();
loadCountries();
