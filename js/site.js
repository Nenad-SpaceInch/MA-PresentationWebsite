(function () {
  var reduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll reveal */
  if (!reduce) {
    var nodes = document.querySelectorAll(".reveal");
    if (nodes.length && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      nodes.forEach(function (el) {
        io.observe(el);
      });
    } else {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Subtle hero parallax (scroll-linked translate on SVG layer groups) */
  if (reduce) {
    var root = document.querySelector("[data-parallax-root]");
    if (root) root.setAttribute("data-parallax-paused", "");
    return;
  }

  var hero = document.querySelector(".hero--parallax");
  var layers = document.querySelectorAll(".hero__layer[data-parallax]");
  if (!hero || !layers.length) return;

  var ticking = false;

  function updateParallax() {
    ticking = false;
    var rect = hero.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    var heroTop = scrollY + rect.top;
    var heroH = rect.height;
    var progress = (scrollY + vh * 0.35 - heroTop) / (heroH + vh * 0.5);
    progress = Math.max(0, Math.min(1, progress));

    layers.forEach(function (layer) {
      var speed = parseFloat(layer.getAttribute("data-parallax")) || 0;
      var offset = (progress - 0.35) * 90 * speed;
      layer.style.transform = "translate3d(0, " + offset.toFixed(2) + "px, 0)";
    });
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateParallax();
})();

(function () {
  var header = document.querySelector(".site-header");
  var btn = document.getElementById("site-nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!header || !btn || !nav) return;

  function setOpen(open) {
    header.classList.toggle("is-nav-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }

  btn.addEventListener("click", function () {
    setOpen(!header.classList.contains("is-nav-open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  window.addEventListener(
    "resize",
    function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setOpen(false);
      }
    },
    { passive: true }
  );

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("is-nav-open")) {
      setOpen(false);
      btn.focus();
    }
  });
})();

(function () {
  var dialog = document.getElementById("media-modal");
  if (!dialog) return;
  var modalVideo = dialog.querySelector(".media-modal__video");
  var closeBtn = dialog.querySelector(".media-modal__close");
  var inner = dialog.querySelector(".media-modal__inner");
  if (!modalVideo) return;

  function pauseInlineVideos() {
    document.querySelectorAll(".js-inline-video").forEach(function (v) {
      v.pause();
    });
  }

  function resumeInlineVideos() {
    document.querySelectorAll(".js-inline-video").forEach(function (v) {
      v.play().catch(function () {});
    });
  }

  function openModal(src) {
    modalVideo.src = src;
    modalVideo.loop = true;
    modalVideo.muted = false;
    modalVideo.controls = true;
    pauseInlineVideos();
    dialog.showModal();
    modalVideo.play().catch(function () {});
  }

  function closeModal() {
    if (dialog.open) dialog.close();
  }

  dialog.addEventListener("close", function () {
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
    resumeInlineVideos();
  });

  document.querySelectorAll(".js-media-open").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var src = btn.getAttribute("data-video-src");
      if (src) openModal(src);
    });
  });

  document.querySelectorAll(".js-media-expand").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-video-src");
      if (src) openModal(src);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closeModal();
    });
  }

  if (inner) {
    inner.addEventListener("click", function (e) {
      if (e.target === inner) closeModal();
    });
  }
})();
