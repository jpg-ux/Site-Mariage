document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const miniatureMode = document.getElementById("miniature-mode");
  const diapoMode = document.getElementById("diapo-mode");

  document.getElementById("start-diapo").addEventListener("click", () => {
    startScreen.classList.add("hidden");
    diapoMode.classList.remove("hidden");
    startDiaporama();
  });

  document.getElementById("switch-to-diapo").addEventListener("click", () => {
    miniatureMode.classList.add("hidden");
    diapoMode.classList.remove("hidden");
    startDiaporama();
  });

  // Miniatures
  const miniaturesDiv = document.getElementById("miniatures");
  const loadMoreBtn = document.getElementById("load-more");
  let currentIndex = 0;
  const BATCH_SIZE = 12;

  function showBatch() {
    const nextItems = photoList.slice(currentIndex, currentIndex + BATCH_SIZE);
    nextItems.forEach((photo) => {
      const img = document.createElement("img");
      img.src = photo.thumb;
      img.alt = "Miniature";
      img.classList.add("miniature");
      img.addEventListener("click", () => openLightbox(photo.url));
      miniaturesDiv.appendChild(img);
    });
    currentIndex += BATCH_SIZE;
    if (currentIndex >= photoList.length) loadMoreBtn.style.display = "none";
  }

  loadMoreBtn.addEventListener("click", showBatch);
  showBatch();

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector("img");
  document.getElementById("lightbox-close").addEventListener("click", () => {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
  });

  function openLightbox(url) {
    lightboxImg.src = url;
    lightbox.classList.remove("hidden");
  }

  // Diaporama
  let currentDiapo = 0;
  const diapoImg = document.getElementById("diapo-img");

  function startDiaporama() {
    showDiapo(currentDiapo);
  }

  function showDiapo(index) {
    const photo = photoList[index];
    if (!photo) return;
    diapoImg.src = photo.url;
  }

  document.getElementById("prev-photo").addEventListener("click", () => {
    currentDiapo = (currentDiapo - 1 + photoList.length) % photoList.length;
    showDiapo(currentDiapo);
  });

  document.getElementById("next-photo").addEventListener("click", () => {
    currentDiapo = (currentDiapo + 1) % photoList.length;
    showDiapo(currentDiapo);
  });
});
