// Script commun : lightbox + diaporama
const miniaturesDiv = document.getElementById("miniatures");
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
const closeBtn = document.getElementById("lightbox-close");

// Diaporama
let currentIndex = 0;
let diaporamaInterval = null;
let intervalDelay = 3000;

function updateLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.remove("hidden");
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  lightboxImg.src = "";
}

function startDiaporama() {
  if (diaporamaInterval) clearInterval(diaporamaInterval);
  diaporamaInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % photoList.length;
    if (photoList[currentIndex] === "accueil.jpg") currentIndex = (currentIndex + 1) % photoList.length;
    updateLightbox("photos/" + photoList[currentIndex]);
  }, intervalDelay);
  updateLightbox("photos/" + photoList[currentIndex]);
}

function stopDiaporama() {
  clearInterval(diaporamaInterval);
  diaporamaInterval = null;
}

function setDiaporamaSpeed(ms) {
  intervalDelay = ms;
  if (diaporamaInterval) startDiaporama();
}

closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target.id === "lightbox") closeLightbox();
});

photoList.forEach((photo, index) => {
  if (photo === "accueil.jpg") return;

  const img = document.createElement("img");
  img.src = "photos/" + photo;
  img.alt = "Photo du mariage";
  img.classList.add("miniature");

  // Survol = affichage en plus grand
  img.addEventListener("mouseover", () => {
    img.classList.add("zoom");
  });
  img.addEventListener("mouseout", () => {
    img.classList.remove("zoom");
  });

  img.addEventListener("click", () => {
    currentIndex = index;
    updateLightbox(img.src);
  });

  miniaturesDiv.appendChild(img);
});

const diapoBtn = document.getElementById("diaporama-btn");
const pauseBtn = document.getElementById("diaporama-pause");
const lentBtn = document.getElementById("diaporama-lent");
const rapideBtn = document.getElementById("diaporama-rapide");

if (diapoBtn) diapoBtn.addEventListener("click", startDiaporama);
if (pauseBtn) pauseBtn.addEventListener("click", stopDiaporama);
if (lentBtn) lentBtn.addEventListener("click", () => setDiaporamaSpeed(5000));
if (rapideBtn) rapideBtn.addEventListener("click", () => setDiaporamaSpeed(1500));
