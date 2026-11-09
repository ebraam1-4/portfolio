const splineViewer = document.getElementById("mySpline");
const navShell = document.getElementById("navShell");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav a");

if (navToggle && navShell) {
  navToggle.addEventListener("click", () => {
    const isOpen = navShell.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navShell.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function hideSplineWatermark() {
  if (!splineViewer || !splineViewer.shadowRoot) return false;

  const root = splineViewer.shadowRoot;
  let found = false;

  const selectors = [
    "#logo",
    "a[href*='spline.design']",
    "a[href*='spline.io']",
    "[data-spline-logo]",
    "a[aria-label*='spline']",
  ];

  selectors.forEach((selector) => {
    root.querySelectorAll(selector).forEach((el) => {
      found = true;
      el.style.display = "none";
      el.style.visibility = "hidden";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.remove();
    });
  });

  if (!root.querySelector("style[data-watermark-hide='true']")) {
    const style = document.createElement("style");
    style.setAttribute("data-watermark-hide", "true");
    style.textContent = `
      #logo,
      a[href*="spline.design"],
      a[href*="spline.io"],
      [data-spline-logo],
      a[aria-label*="spline"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    root.appendChild(style);
  }

  return found;
}

if (splineViewer) {
  const observer = new MutationObserver(() => {
    hideSplineWatermark();
  });

  const watchViewer = () => {
    if (!splineViewer.shadowRoot) {
      setTimeout(watchViewer, 250);
      return;
    }

    observer.observe(splineViewer.shadowRoot, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    let tries = 0;
    const loop = () => {
      hideSplineWatermark();
      if (++tries < 50) setTimeout(loop, 300);
    };

    loop();
  };

  splineViewer.addEventListener("load", () => {
    hideSplineWatermark();
    watchViewer();
  });

  watchViewer();
}


/* ===== Reveal on scroll + active nav link ===== */
(function () {
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  const sections = document.querySelectorAll("main[id], section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          navLinks.forEach((a) => {
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + en.target.id,
            );
          });
        });
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => spy.observe(s));
  }
})();


/* ===== Extra touches: progress bar, typed roles, card spotlight ===== */
(function () {
  const bar = document.getElementById("progress");
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
    };
    addEventListener("scroll", update, { passive: true });
    update();
  }

  const el = document.getElementById("typed");
  if (el) {
    const words = ["fast React interfaces", "WordPress & WooCommerce stores", "responsive, RTL-ready UIs", "things with AI in the loop"];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = words[0];
    } else {
      let w = 0, i = 0, del = false;
      const tick = () => {
        const word = words[w];
        i += del ? -1 : 1;
        el.textContent = word.slice(0, i);
        let t = del ? 35 : 70;
        if (!del && i === word.length) { del = true; t = 1400; }
        else if (del && i === 0) { del = false; w = (w + 1) % words.length; t = 300; }
        setTimeout(tick, t);
      };
      tick();
    }
  }

  document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });
})();
