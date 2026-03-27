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
      var speed = parseFloat(layer.getAttribute("data-parallax"), 10) || 0;
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
