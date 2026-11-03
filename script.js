(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Si una foto no carga, prueba otras rutas y nombres habituales
  var alt = {
    "ruben.jpg": ["Ruben_1.jpg"],
    "pablo.jpg": ["Pablo_1.jpg"],
    "publico-btb.jpg": ["Público_BTB.jpg"],
    "publico-pablo.jpg": ["Público_Pablo_1.jpg"]
  };
  document.querySelectorAll("img").forEach(function (img) {
    var raw = img.getAttribute("src");
    var base = raw.split("/").pop();
    var tried = {};
    var cands = [];
    tried[raw] = true;
    [base].concat(alt[base] || []).forEach(function (n) {
      ["img/", ""].forEach(function (d) { cands.push(d + n); });
    });
    function next() {
      while (cands.length) {
        var c = cands.shift();
        if (!tried[c]) { tried[c] = true; img.src = encodeURI(c); return; }
      }
    }
    img.addEventListener("error", next);
    if (img.complete && img.naturalWidth === 0) next();
  });

  // Glitch breve del título al cargar
  var title = document.querySelector(".glitch");
  if (title && !reduce) {
    setTimeout(function () { title.classList.add("on"); }, 1100);
    setTimeout(function () { title.classList.remove("on"); }, 1900);
  }

  var bar = document.getElementById("progress");
  var heroInner = document.getElementById("heroInner");
  var layers = document.querySelectorAll("[data-speed]");
  var pending = Array.prototype.slice.call(document.querySelectorAll(".reveal, .reveal-img"));
  var ticking = false;

  function update() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";

    // Aparición de textos y fotos al llegar a pantalla
    pending = pending.filter(function (el) {
      if (reduce || el.getBoundingClientRect().top < vh * 0.9) {
        el.classList.add("in");
        return false;
      }
      return true;
    });

    if (!reduce) {
      layers.forEach(function (img) {
        var box = img.parentElement.getBoundingClientRect();
        if (box.bottom < -100 || box.top > vh + 100) return;
        var offset = (box.top + box.height / 2 - vh / 2) * parseFloat(img.dataset.speed);
        img.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      if (heroInner && y < vh) {
        heroInner.style.transform = "translateY(" + (y * 0.35).toFixed(1) + "px) scale(" + (1 - y / vh * 0.15).toFixed(3) + ")";
        heroInner.style.opacity = Math.max(0, 1 - y / (vh * 0.75)).toFixed(2);
      }
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("load", update);
  update();
})();
