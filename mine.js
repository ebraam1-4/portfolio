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

    const loop = () => {
      hideSplineWatermark();
      setTimeout(loop, 300);
    };

    loop();
  };

  splineViewer.addEventListener("load", () => {
    hideSplineWatermark();
    watchViewer();
  });

  watchViewer();
}
