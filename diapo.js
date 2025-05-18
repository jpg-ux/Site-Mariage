const dossier = "photos/";
const extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const vitesses = {
  slow: 8000,
  normal: 4000,
  fast: 1500
};

let images = [];
let imageIndex = 0;
let intervalDiapo;
let lectureAutomatique = true;
let vitesseActuelle = vitesses.normal;

const diaporama = document.getElementById("diaporama");
const compteur = document.getElementById("compteur");
const btnPlayPause = document.getElementById("btn-play-pause");
const btnSlow = document.getElementById("btn-slow");
const btnNormal = document.getElementById("btn-normal");
const btnFast = document.getElementById("btn-fast");
const btnFullscreen = document.getElementById("btn-fullscreen");
const btnHome = document.getElementById("btn-home");

const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxClose = document.getElementById("lightbox-close");

btnHome.addEventListener("click", () => {
  window.location.href = "index.html";
});

function chargerImagesDepuisListe() {
  images = photoList.slice().sort((a, b) => a.localeCompare(b));

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = dossier + src;
    img.alt = "Photo de mariage";
    img.setAttribute("tabindex", "-1");
    diaporama.appendChild(img);

    // ouvrir lightbox au clic
    img.addEventListener("click", () => {
      ouvrirLightbox(img.src);
    });
  });

  if (images.length > 0) {
    afficherImage(0);
    demarrerDiaporama();
  } else {
    compteur.textContent = "0 / 0";
  }
}

function afficherImage(index) {
  const allImages = diaporama.querySelectorAll("img");
  allImages.forEach((img, i) => {
    img.classList.toggle("active", i === index);
  });
  compteur.textContent = `${index + 1} / ${images.length}`;
  imageIndex = index;
}

function imageSuivante() {
  imageIndex = (imageIndex + 1) % images.length;
  afficherImage(imageIndex);
}

function imagePrecedente() {
  imageIndex = (imageIndex - 1 + images.length) % images.length;
  afficherImage(imageIndex);
}

function demarrerDiaporama() {
  lectureAutomatique = true;
  btnPlayPause.textContent = "⏸ Pause";
  clearInterval(intervalDiapo);
  intervalDiapo = setInterval(imageSuivante, vitesseActuelle);
}

function arreterDiaporama() {
  lectureAutomatique = false;
  btnPlayPause.textContent = "▶ Lecture";
  clearInterval(intervalDiapo);
}

btnPlayPause.addEventListener("click", () => {
  if (lectureAutomatique) {
    arreterDiaporama();
  } else {
    demarrerDiaporama();
  }
});

btnSlow.addEventListener("click", () => {
  vitesseActuelle = vitesses.slow;
  if (lectureAutomatique) demarrerDiaporama();
});

btnNormal.addEventListener("click", () => {
  vitesseActuelle = vitesses.normal;
  if (lectureAutomatique) demarrerDiaporama();
});

btnFast.addEventListener("click", () => {
  vitesseActuelle = vitesses.fast;
  if (lectureAutomatique) demarrerDiaporama();
});

btnFullscreen.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    btnFullscreen.textContent = "❎ Quitter";
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      btnFullscreen.textContent = "⛶ Plein écran";
    }
  }
});

// Contrôles clavier
document.addEventListener("keydown", (e) => {
  if (e.target === lightboxClose || lightbox.style.display === "flex") {
    if (e.key === "Escape") fermerLightbox();
    return;
  }

  switch(e.key) {
    case "ArrowRight":
      imageSuivante();
      if (lectureAutomatique) {
        clearInterval(intervalDiapo);
        demarrerDiaporama();
      }
      break;
    case "ArrowLeft":
      imagePrecedente();
      if (lectureAutomatique) {
        clearInterval(intervalDiapo);
        demarrerDiaporama();
      }
      break;
    case " ":
      e.preventDefault();
      if (lectureAutomatique) {
        arreterDiaporama();
      } else {
        demarrerDiaporama();
      }
      break;
    case "f":
      btnFullscreen.click();
      break;
  }
});

// Lightbox fonctions
function ouvrirLightbox(src) {
  lightboxImg.src = src;
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function fermerLightbox() {
  lightbox.style.display = "none";
  lightboxImg.src = "";
  document.body.style.overflow = "";
  diaporama.focus();
}

lightboxClose.addEventListener("click", fermerLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) fermerLightbox();
});

// Démarrage avec la liste générée
chargerImagesDepuisListe();
