const textosContainer = document.querySelector(".textos");
const cards = document.querySelectorAll(".card-secao");
const botoesNav = document.querySelectorAll(".nav-btn");
const logoImg = document.getElementById("logo-img");
const themeIcon = document.getElementById("theme-icon");
const themeText = document.getElementById("theme-text");

let indexAtual = 0;
let animando = false;
const totalCards = cards.length;

function isMobile() {
  return window.innerWidth <= 868;
}


function toggleTema() {
  const temaAtual = document.documentElement.getAttribute("data-theme");

  if (temaAtual === "light") {
    document.documentElement.removeAttribute("data-theme");
    themeText.innerText = "Modo Claro";
    themeIcon.className = "fas fa-sun";
    logoImg.src = "image/dark.png";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    themeText.innerText = "Modo Escuro";
    themeIcon.className = "fas fa-moon";
    logoImg.src = "image/light.png";
  }
}

function abrirModal(titulo, imagemUrl, descricao, linkGithub, linkSite) {
  document.getElementById("modal-titulo").innerText = titulo;
  document.getElementById("modal-imagem").src = imagemUrl;
  document.getElementById("modal-descricao").innerText = descricao;
  document.getElementById("modal-link-github").href = linkGithub;
  document.getElementById("modal-link-site").href = linkSite;

  document.getElementById("projeto-modal").classList.add("active");
}

function fecharModal() {
  document.getElementById("projeto-modal").classList.remove("active");
}

function fecharModalExterno(event) {
  if (event.target.classList.contains("modal-overlay")) {
    fecharModal();
  }
}

function getAlturaCard() {
  return cards[0].offsetHeight;
}

function atualizarMenu() {
  botoesNav.forEach((btn, i) => {
    if (i === indexAtual) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function moverContainer() {
  if (isMobile()) return;

  animando = true;
  atualizarMenu();
  const altura = getAlturaCard();

  gsap.to(textosContainer, {
    y: -(indexAtual * altura),
    duration: 0.8,
    ease: "power2.out",
    onComplete: () => {
      animando = false;
    },
  });

  gsap.fromTo(
    cards[indexAtual],
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
  );
}

function mudarTexto(direcao) {
  if (isMobile()) return;
  if (
    animando ||
    document.getElementById("projeto-modal").classList.contains("active")
  )
    return;

  if (direcao === "down" && indexAtual < totalCards - 1) {
    indexAtual++;
    moverContainer();
  } else if (direcao === "up" && indexAtual > 0) {
    indexAtual--;
    moverContainer();
  }
}

function irParaTexto(index) {
  indexAtual = index;

  if (isMobile()) {
    const targetElement = document.getElementById(`secao-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      atualizarMenu();
    }
  } else {
    if (animando) return;
    moverContainer();
  }
}

window.addEventListener(
  "wheel",
  (e) => {
    if (isMobile()) return;
    if (e.deltaY > 0) {
      mudarTexto("down");
    } else {
      mudarTexto("up");
    }
  },
  { passive: true },
);

let ts;
window.addEventListener(
  "touchstart",
  (e) => {
    if (isMobile()) return;
    ts = e.touches[0].clientY;
  },
  { passive: true },
);

window.addEventListener(
  "touchend",
  (e) => {
    if (isMobile()) return;
    let te = e.changedTouches[0].clientY;
    if (ts > te + 50) {
      mudarTexto("down");
    } else if (ts < te - 50) {
      mudarTexto("up");
    }
  },
  { passive: true },
);

window.addEventListener("resize", () => {
  if (isMobile()) {
    gsap.set(textosContainer, { clearProps: "all" });
    atualizarMenu();
  } else {
    gsap.set(textosContainer, { y: -(indexAtual * getAlturaCard()) });
  }
});
