/* ------------------------------------------------------------------
   buttons.js
   Makes every clickable button and card on the site feel alive:
   - a soft ripple where you click (also on keyboard Enter)
   - a glow that follows the cursor
   - main buttons lean gently toward the cursor (magnetic)
   - a small press-down effect
   It injects its own CSS, so nothing else needs to change.
   Add to any page with:  <script src="buttons.js"></script>
------------------------------------------------------------------- */
(function () {
  "use strict";

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* what gets the treatment */
  var FX = "button:not(.star), .btn, .card";
  var MAGNETIC = ".btn, .theme, .copy";

  /* ---- styles ---- */
  var css = [
    ".fx{position:relative;overflow:hidden;isolation:isolate;-webkit-tap-highlight-color:transparent}",
    ".fx::before{content:'';position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;",
    "  transition:opacity .25s ease;",
    "  background:radial-gradient(130px circle at var(--mx,50%) var(--my,50%), var(--fx-glow, rgba(255,255,255,.22)), transparent 65%)}",
    ".fx:hover::before{opacity:1}",
    ".card.fx{--fx-glow:rgba(138,59,31,.12)}",
    ":root[data-theme='dark'] .card.fx{--fx-glow:rgba(217,138,98,.14)}",
    ".chip.fx, .step.fx, .theme.fx, .copy.fx{--fx-glow:rgba(138,59,31,.16)}",
    ".chip[aria-pressed='true'].fx, .chip[aria-selected='true'].fx{--fx-glow:rgba(255,255,255,.2)}",
    ".fx-ripple{position:absolute;z-index:0;border-radius:50%;pointer-events:none;background:currentColor;",
    "  opacity:.28;transform:scale(0);animation:fx-ripple .65s ease-out forwards}",
    "@keyframes fx-ripple{to{transform:scale(1);opacity:0}}",
    ".fx-mag{transform:translate(var(--tx,0px),var(--ty,0px)) scale(var(--s,1));",
    "  transition:transform .18s ease-out, background .2s, color .2s, border-color .2s !important}",
    ".fx-mag:active{--s:.95}",
    ".fx-mag.fx-away{transition:transform .45s cubic-bezier(.2,1.4,.4,1), background .2s, color .2s, border-color .2s !important}",
    "button.fx:not(.fx-mag):not(.step):active{transform:scale(.97)}",
    "@media (hover:none){.fx::before{display:none}}",
    "@media (prefers-reduced-motion:reduce){.fx-ripple{display:none}.fx-mag{transform:none !important}}"
  ].join("\n");
  var tag = document.createElement("style");
  tag.id = "buttons-js-styles";
  tag.textContent = css;
  document.head.appendChild(tag);

  function target(e) {
    var t = e.target && e.target.closest ? e.target.closest(FX) : null;
    if (!t || t.disabled) return null;
    if (!t.classList.contains("fx")) {
      t.classList.add("fx");
      if (t.matches(MAGNETIC)) t.classList.add("fx-mag");
    }
    return t;
  }

  /* ---- glow follows the cursor ---- */
  document.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    var el = target(e);
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left) + "px");
    el.style.setProperty("--my", (e.clientY - r.top) + "px");

    /* ---- magnetic lean ---- */
    if (!reduce && el.classList.contains("fx-mag")) {
      el.classList.remove("fx-away");
      var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.setProperty("--tx", (dx * 5).toFixed(1) + "px");
      el.style.setProperty("--ty", (dy * 4).toFixed(1) + "px");
    }
  }, { passive: true });

  function release(el) {
    if (!el || !el.classList.contains("fx-mag")) return;
    el.classList.add("fx-away");
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
  }
  document.addEventListener("pointerout", function (e) {
    var el = e.target && e.target.closest ? e.target.closest(MAGNETIC) : null;
    if (el && !el.contains(e.relatedTarget)) release(el);
  });

  /* ---- ripple ---- */
  function ripple(el, x, y) {
    if (reduce) return;
    var r = el.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 2.2;
    var s = document.createElement("span");
    s.className = "fx-ripple";
    s.style.width = s.style.height = size + "px";
    s.style.left = (x - r.left - size / 2) + "px";
    s.style.top = (y - r.top - size / 2) + "px";
    el.appendChild(s);
    setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
  }
  document.addEventListener("click", function (e) {
    var el = target(e);
    if (!el) return;
    var r = el.getBoundingClientRect();
    /* keyboard "clicks" have no pointer position, so ripple from the centre */
    var x = e.detail === 0 ? r.left + r.width / 2 : e.clientX;
    var y = e.detail === 0 ? r.top + r.height / 2 : e.clientY;
    ripple(el, x, y);
  });
})();
