/* ------------------------------------------------------------------
   Edit these two lines with Alphonse's real details.
   They fill in every email and LinkedIn link across the site.
------------------------------------------------------------------- */
var EMAIL = "alphonseucheokeke@gmail.com";
var LINKEDIN = "linkedin.com/in/alphonse-ucheokeke";

(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* email + linkedin placeholders */
  $all(".js-email").forEach(function (a) {
    a.textContent = EMAIL;
    if (a.tagName === "A") a.href = "mailto:" + EMAIL;
  });
  $all(".js-mailto").forEach(function (a) {
    a.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(a.getAttribute("data-subject") || "Hello");
  });
  $all(".js-linkedin").forEach(function (a) { a.href = LINKEDIN; });

  /* theme toggle */
  var themeBtn = $("#theme");
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function themeLabel() { if (themeBtn) themeBtn.textContent = currentTheme() === "dark" ? "Light" : "Dark"; }
  themeLabel();
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    themeLabel();
  });

  /* reading progress bar */
  var bar = $("#bar");
  function onScroll() {
    if (!bar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* reveal on scroll */
  var reveals = $all(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* page transitions */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var h = a.getAttribute("href");
    if (!h || h.charAt(0) === "#" || a.target || /^(mailto:|tel:|https?:)/.test(h)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(function () { location.href = a.href; }, reduce ? 0 : 220);
  });
  window.addEventListener("pageshow", function () { document.body.classList.remove("leaving"); });

  /* rotating word in the headline */
  var sw = $("#swap");
  if (sw && !reduce) {
    var words = sw.getAttribute("data-words").split("|"), wi = 0;
    setInterval(function () {
      sw.classList.add("out");
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        sw.textContent = words[wi];
        sw.classList.remove("out");
      }, 300);
    }, 2800);
  }

  /* count-up numbers */
  var counters = $all("[data-count]");
  function runCount(el) {
    var end = parseInt(el.getAttribute("data-count"), 10), start = null, dur = 1300;
    if (reduce) { el.textContent = end.toLocaleString(); return; }
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { co.observe(c); });
    } else counters.forEach(runCount);
  }

  /* filter chips (work page) */
  var filterChips = $all("[data-filter]");
  var things = $all("[data-tags]");
  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      filterChips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      things.forEach(function (li) {
        var tags = li.getAttribute("data-tags").split(" ");
        li.hidden = !(f === "all" || tags.indexOf(f) > -1);
      });
    });
  });

  /* volunteer journey stepper */
  var STEPS = [
    ["Attract", "Reach people where they already are, and say plainly what volunteering here actually involves."],
    ["Match", "Ask what someone is good at and what they care about before handing them a role."],
    ["Onboard", "A clear welcome for new people, and an easy way back in for the ones who drifted away."],
    ["Listen", "Short surveys and honest conversations to learn why people stopped showing up."],
    ["Engage", "Real assignments, someone to learn from, and room to share their own skills."],
    ["Recognise", "Say thank you in specific ways. Generic praise is forgotten by the next morning."],
    ["Grow", "Spot the people who could lead a project, become an ambassador or join the team."],
    ["Measure", "Track participation, retention and progression, so we know what is really working."]
  ];
  var stepBtns = $all(".step"), stepPanel = $("#step-panel");
  function showStep(i) {
    stepBtns.forEach(function (b, k) { b.setAttribute("aria-selected", k === i ? "true" : "false"); });
    if (!stepPanel) return;
    $("h3", stepPanel).textContent = (i + 1) + ". " + STEPS[i][0];
    $("p", stepPanel).textContent = STEPS[i][1];
    stepPanel.classList.remove("swapping");
    void stepPanel.offsetWidth;
    stepPanel.classList.add("swapping");
  }
  stepBtns.forEach(function (b, i) { b.addEventListener("click", function () { showStep(i); }); });
  if (stepBtns.length) showStep(0);

  /* background page topics */
  var TOPICS = {
    tech: "How technology changes the way people live together. I studied Heidegger's worries about technology in philosophy class, and I still ask the same thing about every new tool: what is it quietly doing to us?",
    boys: "Why boys learn so early to hide what they feel, and what happens to them later when nobody has taught them another way. Working near this at BCF has made it feel a lot less abstract.",
    funding: "How a small organisation can pay for its mission without depending on one donor. Grants, corporate partners, earned income: I want to understand how they fit together.",
    access: "What it takes for a young person in Nigeria to hear about an opportunity before the deadline passes. This is the question behind OpportunityOS."
  };
  var topicChips = $all("[data-topic]"), topicPanel = $("#topic-panel");
  topicChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      topicChips.forEach(function (c) { c.setAttribute("aria-selected", c === chip ? "true" : "false"); });
      var p = $("p", topicPanel);
      p.textContent = TOPICS[chip.getAttribute("data-topic")];
      topicPanel.classList.remove("swapping");
      void topicPanel.offsetWidth;
      topicPanel.classList.add("swapping");
    });
  });

  /* OpportunityOS demo (sample data only) */
  var OPPS = [
    { t: "Community Health Fellowship", o: "Sample Foundation", k: "Fellowship", m: "Remote · 6 months" },
    { t: "Women in Policy Scholarship", o: "Example University", k: "Scholarship", m: "Postgraduate · Full tuition" },
    { t: "Programme Support Intern", o: "Sample NGO", k: "Internship", m: "Hybrid · 3 months" },
    { t: "Grant Writing Workshop", o: "Example Network", k: "Training", m: "Online · 2 weeks" },
    { t: "Youth Leadership Programme", o: "Sample Institute", k: "Fellowship", m: "Hybrid · 1 year" },
    { t: "Data for Good Bootcamp", o: "Example Lab", k: "Training", m: "Online · 6 weeks" },
    { t: "Public Health Master's Award", o: "Sample Trust", k: "Scholarship", m: "Overseas · Partial" },
    { t: "Monitoring and Evaluation Intern", o: "Example NGO", k: "Internship", m: "On-site · 4 months" }
  ];
  var oppList = $("#opps");
  if (oppList) {
    var oppKind = "All", oppQuery = "", saved = {};
    var oppSearch = $("#opp-search"), oppCount = $("#opp-count");
    var oppChips = $all("[data-kind]");
    var renderOpps = function () {
      oppList.innerHTML = "";
      var shown = OPPS.filter(function (x) {
        var okKind = oppKind === "All" || x.k === oppKind;
        var q = oppQuery.toLowerCase();
        return okKind && (!q || (x.t + " " + x.o + " " + x.k).toLowerCase().indexOf(q) > -1);
      });
      shown.forEach(function (x) {
        var d = document.createElement("div"); d.className = "opp";
        var k = document.createElement("span"); k.className = "k"; k.textContent = x.k;
        var n = document.createElement("span"); n.className = "n"; n.textContent = x.t;
        var m = document.createElement("span"); m.className = "m"; m.textContent = x.o + " · " + x.m;
        var s = document.createElement("button"); s.className = "star"; s.type = "button";
        s.setAttribute("aria-label", "Save " + x.t);
        s.setAttribute("aria-pressed", saved[x.t] ? "true" : "false");
        s.textContent = saved[x.t] ? "★" : "☆";
        s.addEventListener("click", function () {
          saved[x.t] = !saved[x.t];
          s.setAttribute("aria-pressed", saved[x.t] ? "true" : "false");
          s.textContent = saved[x.t] ? "★" : "☆";
          updateSaved();
        });
        d.appendChild(k); d.appendChild(n); d.appendChild(m); d.appendChild(s);
        oppList.appendChild(d);
      });
      if (!shown.length) {
        var e = document.createElement("p"); e.className = "empty"; e.textContent = "Nothing matches that yet.";
        oppList.appendChild(e);
      }
    };
    var updateSaved = function () {
      var n = Object.keys(saved).filter(function (k) { return saved[k]; }).length;
      oppCount.textContent = n === 0 ? "Star anything you like" : n + " saved";
    };
    oppChips.forEach(function (c) {
      c.addEventListener("click", function () {
        oppKind = c.getAttribute("data-kind");
        oppChips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
        renderOpps();
      });
    });
    oppSearch.addEventListener("input", function () { oppQuery = oppSearch.value; renderOpps(); });
    renderOpps(); updateSaved();
  }

  /* team shuffler */
  var shuffleBtn = $("#shuffle");
  if (shuffleBtn) {
    var namesBox = $("#names"), out = $("#teams");
    var shuffle = function () {
      var names = namesBox.value.split(/[\n,]+/).map(function (s) { return s.trim(); }).filter(Boolean);
      for (var i = names.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)), t = names[i]; names[i] = names[j]; names[j] = t;
      }
      var half = Math.ceil(names.length / 2), A = names.slice(0, half), B = names.slice(half);
      out.innerHTML = "";
      [["Team A", A], ["Team B", B]].forEach(function (pair) {
        var box = document.createElement("div"); box.className = "team";
        var h = document.createElement("h4"); h.textContent = pair[0] + " (" + pair[1].length + ")";
        var ul = document.createElement("ul");
        pair[1].forEach(function (nm, idx) {
          var li = document.createElement("li"); li.textContent = nm; li.style.setProperty("--d", (idx * 0.05) + "s");
          ul.appendChild(li);
        });
        box.appendChild(h); box.appendChild(ul); out.appendChild(box);
      });
    };
    shuffleBtn.addEventListener("click", shuffle);
    shuffle();
  }

  /* contact form: opens the visitor's email app with the message filled in */
  var form = $("#mailform");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = form.elements.name.value.trim(), f = form.elements.email.value.trim(), m = form.elements.message.value.trim();
      var body = m + "\n\n" + n + (f ? "\n" + f : "");
      location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Hello from " + (n || "your website")) + "&body=" + encodeURIComponent(body);
    });
  }
  var copyBtn = $("#copy");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    function done() { copyBtn.textContent = "Copied"; setTimeout(function () { copyBtn.textContent = "Copy"; }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(done, done);
    else {
      var t = document.createElement("textarea"); t.value = EMAIL; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(t); done();
    }
  });

  /* year */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
