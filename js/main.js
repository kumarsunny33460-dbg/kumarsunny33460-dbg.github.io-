/* ============================================================
   Sunny Kumar — Portfolio interactions
   Vanilla JS, no dependencies
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#f4f6fc" : "#06080f");
  };

  const storedTheme = (() => {
    try { return localStorage.getItem("sk-theme"); } catch { return null; }
  })();
  applyTheme(storedTheme === "light" ? "light" : "dark");

  themeBtn?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("sk-theme", next); } catch {}
    showToast(next === "dark" ? "Dark theme enabled" : "Light theme enabled");
  });

  /* ---------- Preloader ---------- */
  const preloader = $("#preloader");
  const hidePreloader = () => {
    preloader?.classList.add("done");
    document.body.classList.add("loaded");
    setTimeout(() => preloader?.remove(), 800);
  };
  if (preloader) {
    if (reduced) hidePreloader();
    else window.addEventListener("load", () => setTimeout(hidePreloader, 450), { once: true });
    setTimeout(hidePreloader, 4000); // safety net
  } else {
    document.body.classList.add("loaded");
  }

  // The portrait fades in on its own decode, so a slow font CDN never hides it
  const photo = $(".photo");
  if (photo) {
    const revealPhoto = () => photo.classList.add("is-ready");
    if (photo.complete && photo.naturalWidth) revealPhoto();
    else photo.addEventListener("load", revealPhoto, { once: true });
    photo.addEventListener("error", revealPhoto, { once: true });
  }

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  /* ---------- Navbar ---------- */
  const nav = $("#nav");
  const navLinks = $("#navLinks");
  const burger = $("#burger");
  const navProgress = $("#navProgress");
  const toTop = $("#toTop");

  const onScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle("scrolled", y > 40);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    if (navProgress) navProgress.style.width = pct.toFixed(2) + "%";

    toTop?.classList.toggle("show", y > 620);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const closeMenu = () => {
    navLinks?.classList.remove("open");
    burger?.classList.remove("open");
    burger?.setAttribute("aria-expanded", "false");
  };
  burger?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  $$(".nav__link").forEach((a) => a.addEventListener("click", closeMenu));

  // Smooth anchor scroll with nav offset
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const offset = (nav?.offsetHeight || 64) + 14;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    });
  });

  /* ---------- Scrollspy ---------- */
  const sections = $$("main section[id]");
  const linkFor = (id) => $(`.nav__link[href="#${id}"]`);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          $$(".nav__link").forEach((l) => l.classList.remove("active"));
          linkFor(entry.target.id)?.classList.add("active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const rev = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => rev.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Typewriter ---------- */
  const tw = $("#typewriter");
  const ROLES = [
    "cloud-native backends.",
    "DevOps pipelines that actually ship.",
    "secure Flask applications.",
    "Kubernetes & Terraform infrastructure.",
    "observability-first platforms.",
    "AI/ML experiments in Python."
  ];

  if (tw && !reduced) {
    let ri = 0, ci = 0, deleting = false;
    const type = () => {
      const word = ROLES[ri];
      ci += deleting ? -1 : 1;
      tw.textContent = word.slice(0, ci);
      let delay = deleting ? 38 : 78;
      if (!deleting && ci === word.length) { delay = 1700; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % ROLES.length; delay = 320; }
      setTimeout(type, delay);
    };
    setTimeout(type, 900);
  } else if (tw) {
    tw.textContent = ROLES[0];
  }

  /* ---------- Counters ---------- */
  const counters = $$("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    const dur = 1500;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const cobs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cobs.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Skill bars ---------- */
  const skillBars = $$(".skill__bar i");
  const fillBars = (bar) => { bar.style.width = bar.style.getPropertyValue("--w") || "0%"; };
  if ("IntersectionObserver" in window) {
    const sobs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setTimeout(() => fillBars(entry.target), 120);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    skillBars.forEach((b) => sobs.observe(b));
  } else {
    skillBars.forEach(fillBars);
  }

  /* ---------- Skills filter ---------- */
  const tabs = $$(".skill-tab");
  const cols = $$(".skill-col");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      const f = tab.dataset.filter;
      cols.forEach((col) => {
        const match = f === "all" || $$(".skill", col).some((s) => s.dataset.cat === f);
        col.classList.toggle("hidden", !match);
        if (match) {
          $$(".skill__bar i", col).forEach((b) => { b.style.width = "0%"; });
          requestAnimationFrame(() => $$(".skill__bar i", col).forEach((b) => setTimeout(() => fillBars(b), 60)));
        }
      });
    });
  });

  /* ---------- Marquee ---------- */
  const MARQUEE = [
    ["python", "Python"], ["docker", "Docker"], ["kubernetes", "Kubernetes"],
    ["terraform", "Terraform"], ["amazonwebservices-lt", "AWS"], ["flask", "Flask"],
    ["mongodb", "MongoDB"], ["postgresql", "PostgreSQL"], ["githubactions", "GitHub Actions"],
    ["prometheus", "Prometheus"], ["grafana", "Grafana"], ["git", "Git"],
    ["javascript", "JavaScript"], ["html5", "HTML5"], ["css3-lt", "CSS3"],
    ["tensorflow", "TensorFlow"], ["pytorch", "PyTorch"], ["huggingface", "Transformers"],
    ["pytest", "pytest"], ["nginx", "Nginx"], ["linux", "Linux"],
    ["helm-lt", "Helm"], ["redis", "Redis"], ["elasticsearch-lt", "Elasticsearch"]
  ];

  const buildMarquee = (track, list) => {
    if (!track) return;
    const html = list
      .map(([icon, label]) =>
        `<span class="marquee__item"><img src="assets/icons/${icon}.svg" alt="" width="20" height="20" />${label}</span>`
      )
      .join("");
    track.innerHTML = html + html; // duplicate for a seamless loop
  };
  buildMarquee($("#marquee .marquee__track"), MARQUEE);
  buildMarquee($("#marquee2"), [...MARQUEE].reverse());

  /* ---------- Tilt + pointer glow ---------- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        card.style.transform =
          `perspective(1000px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });

    const glow = $("#cursorGlow");
    if (glow) {
      let gx = 0, gy = 0, cx = 0, cy = 0, active = false;
      window.addEventListener("mousemove", (e) => {
        gx = e.clientX; gy = e.clientY;
        if (!active) { active = true; glow.classList.add("on"); }
      });
      const loop = () => {
        cx += (gx - cx) * 0.12;
        cy += (gy - cy) * 0.12;
        glow.style.left = cx + "px";
        glow.style.top = cy + "px";
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  /* ---------- Back to top ---------- */
  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");
  const EMAIL = "kumarsunny33460@gmail.com";

  const setError = (name, msg) => {
    const field = form?.querySelector(`[name="${name}"]`)?.closest(".field");
    const slot = form?.querySelector(`[data-err="${name}"]`);
    if (field) field.classList.toggle("invalid", !!msg);
    if (slot) slot.textContent = msg || "";
  };

  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address."),
    message: (v) => (v.trim().length >= 12 ? "" : "Please write at least a dozen characters.")
  };

  form?.querySelectorAll("input, textarea").forEach((el) => {
    el.addEventListener("blur", () => {
      if (validators[el.name]) setError(el.name, validators[el.name](el.value));
    });
    el.addEventListener("input", () => {
      if (el.closest(".field")?.classList.contains("invalid")) {
        setError(el.name, validators[el.name] ? validators[el.name](el.value) : "");
      }
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    Object.entries(validators).forEach(([name, fn]) => {
      const el = form.querySelector(`[name="${name}"]`);
      const msg = fn(el.value);
      setError(name, msg);
      if (msg) ok = false;
    });
    if (!ok) {
      showToast("Please fix the highlighted fields");
      form.querySelector(".field.invalid input, .field.invalid textarea")?.focus();
      return;
    }

    const data = new FormData(form);
    const subject = (data.get("subject") || "Portfolio enquiry").toString().trim();
    const body =
      `Name: ${data.get("name")}\n` +
      `Email: ${data.get("email")}\n\n` +
      `${data.get("message")}\n\n— Sent from sunnykumar.dev portfolio`;

    const href =
      `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const btn = $("#submitBtn");
    const label = btn?.querySelector(".btn__label");
    if (btn && label) {
      btn.disabled = true;
      label.textContent = "Opening your mail client…";
    }
    window.location.href = href;

    setTimeout(() => {
      if (btn && label) {
        btn.disabled = false;
        label.textContent = "Send message";
      }
      form.reset();
      showToast("Your mail client should be open — thanks for reaching out!");
    }, 900);
  });

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Keyboard shortcuts ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    if (e.key === "Escape") closeMenu();
    const map = { 1: "#about", 2: "#skills", 3: "#projects", 4: "#experience", 5: "#contact" };
    if (map[e.key]) {
      const t = document.querySelector(map[e.key]);
      if (t) {
        const offset = (nav?.offsetHeight || 64) + 14;
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
      }
    }
  });
})();
