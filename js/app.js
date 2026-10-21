(function () {
  const cfg = window.PAStore.mergeConfig();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function invitationUrl() {
    if (cfg.publicUrl) return cfg.publicUrl;
    if (location.protocol === "http:" || location.protocol === "https:") return location.href.split("#")[0];
    return "";
  }

  function mapsUrl(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatDate(isoDate) {
    if (!isoDate) return "";
    const d = new Date(isoDate + "T00:00:00+05:30");
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: cfg.wedding.timezone || "Asia/Kolkata",
    });
  }

  /* Opening sequence */
  const gate = document.getElementById("gate");
  const envelope = document.getElementById("envelope");
  const petals = document.getElementById("petals");

  function scatterPetals() {
    petals.innerHTML = "";
    for (let i = 0; i < 18; i += 1) {
      const p = document.createElement("span");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 0.8 + "s";
      petals.appendChild(p);
    }
  }

  function closeGate() {
    document.body.classList.remove("is-locked");
    gate.classList.add("is-leaving");
    setTimeout(() => {
      gate.style.display = "none";
    }, reduced ? 0 : 900);
  }

  function openInvitation(withMusic) {
    envelope.classList.add("is-open");
    gate.classList.add("is-bloom");
    scatterPetals();
    if (withMusic) music.play();
    setTimeout(closeGate, reduced ? 0 : 1600);
  }

  document.getElementById("open-invite").addEventListener("click", () => openInvitation(true));
  document.getElementById("skip-intro").addEventListener("click", closeGate);
  envelope.addEventListener("click", () => openInvitation(true));
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openInvitation(true);
    }
  });

  if (reduced) closeGate();

  /* Nav */
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  /* Content binding */
  document.getElementById("hero-blessing").textContent = cfg.couple.blessingHindi;
  document.getElementById("hero-headline").textContent = cfg.couple.headline;
  document.getElementById("hero-date").textContent = cfg.wedding.dateLabel;
  document.getElementById("hero-venue").textContent =
    cfg.venue.name + " · " + cfg.venue.city;
  document.getElementById("couple-blessing").textContent = cfg.couple.blessingHindi;
  document.getElementById("couple-tagline").textContent = cfg.couple.tagline;
  document.getElementById("couple-names").textContent = cfg.couple.displayName;
  document.getElementById("couple-quote").textContent = cfg.couple.quote;
  document.getElementById("couple-intro").textContent = cfg.couple.intro;
  document.getElementById("venue-name").textContent = cfg.venue.name;
  document.getElementById("venue-address").textContent = cfg.venue.address;
  document.getElementById("venue-date").textContent =
    (cfg.wedding.dayLabel ? cfg.wedding.dayLabel + ", " : "") + cfg.wedding.dateLabel;
  document.getElementById("venue-time").textContent = cfg.wedding.timeLabel || "";
  const maps = mapsUrl(cfg.venue.mapsQuery || cfg.venue.address);
  document.getElementById("maps-link").href = maps;
  document.getElementById("map-embed").innerHTML =
    '<iframe title="Venue map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=' +
    encodeURIComponent(cfg.venue.mapsQuery || cfg.venue.address) +
    '&output=embed"></iframe>';

  /* Story */
  const storyList = document.getElementById("story-list");
  const stories = (cfg.story || []).filter((s) => s.published);
  storyList.innerHTML = stories
    .map(
      (item) => `
      <article class="milestone in-view">
        <div class="milestone__media">
          <img src="${item.image}" alt="${item.title}" width="800" height="1000" loading="lazy" />
        </div>
        <div>
          ${item.date ? `<time>${item.date}</time>` : ""}
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </article>`
    )
    .join("");

  /* Events */
  const publishedEvents = (cfg.events || []).filter((e) => e.published);
  const eventList = document.getElementById("event-list");
  if (!publishedEvents.length) {
    eventList.innerHTML = '<p class="empty">Celebration details will appear here once they are announced.</p>';
  } else {
    eventList.innerHTML = publishedEvents
      .map((ev) => {
        const when = [formatDate(ev.date), ev.start && ev.start + (ev.end ? " – " + ev.end : "")].filter(Boolean).join(" · ");
        const shareText = encodeURIComponent(
          `You are invited to ${ev.title} for the wedding of ${cfg.couple.displayName}. ${when}. ${ev.venue}, ${ev.address}`
        );
        return `
        <article class="event-card in-view">
          ${ev.image ? `<img src="${ev.image}" alt="${ev.title}" width="800" height="500" loading="lazy" />` : ""}
          <div class="event-card__body">
            <h3>${ev.title}</h3>
            <p class="event-meta">${when}</p>
            <p>${ev.description || ""}</p>
            <p class="event-meta">${ev.venue}<br>${ev.address}</p>
            ${ev.dressCode ? `<p>Dress code: ${ev.dressCode}</p>` : ""}
            <div class="event-actions">
              <a class="btn btn--dark" href="${mapsUrl(ev.address || ev.venue)}" target="_blank" rel="noopener">Directions</a>
              <a class="btn btn--dark" href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener">WhatsApp</a>
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  const rsvpEvents = document.getElementById("rsvp-events");
  rsvpEvents.innerHTML = publishedEvents
    .map(
      (ev) =>
        `<label><input type="checkbox" name="eventIds" value="${ev.id}" checked /> ${ev.title}</label>`
    )
    .join("");

  const dietary = document.getElementById("dietary");
  dietary.innerHTML = (cfg.rsvp.dietaryOptions || []).map((o) => `<option>${o}</option>`).join("");
  document.querySelector('[name="attendees"]').max = cfg.rsvp.maxAttendees || 8;

  /* Gallery */
  const photos = (cfg.gallery || []).filter((p) => p.published);
  const filters = document.getElementById("gallery-filters");
  const grid = document.getElementById("gallery-grid");
  const cats = cfg.galleryCategories || ["All"];
  let activeCat = "All";

  function renderGallery() {
    const items = photos.filter((p) => activeCat === "All" || p.category === activeCat);
    if (!items.length) {
      grid.innerHTML = '<p class="empty">Photographs will be shared here soon.</p>';
      return;
    }
    grid.innerHTML = items
      .map(
        (p, i) => `
        <figure tabindex="0" data-index="${photos.indexOf(p)}">
          <img src="${p.src}" alt="${p.alt}" width="800" height="1066" loading="lazy" />
          <figcaption>${p.caption || ""}</figcaption>
        </figure>`
      )
      .join("");
  }

  filters.innerHTML = cats
    .map((c) => `<button class="chip${c === "All" ? " is-active" : ""}" type="button" data-cat="${c}">${c}</button>`)
    .join("");
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    filters.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b === btn));
    renderGallery();
  });
  renderGallery();

  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lightbox-image");
  const lbCaption = document.getElementById("lightbox-caption");
  let lbIndex = 0;

  function openLightbox(index) {
    lbIndex = index;
    const photo = photos[lbIndex];
    if (!photo) return;
    lbImage.src = photo.src;
    lbImage.alt = photo.alt;
    lbCaption.textContent = photo.caption || "";
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.classList.remove("is-open");
  }

  grid.addEventListener("click", (e) => {
    const fig = e.target.closest("figure");
    if (fig) openLightbox(Number(fig.dataset.index));
  });
  grid.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const fig = e.target.closest("figure");
      if (fig) openLightbox(Number(fig.dataset.index));
    }
  });
  lightbox.querySelector(".close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".prev").addEventListener("click", () => openLightbox((lbIndex - 1 + photos.length) % photos.length));
  lightbox.querySelector(".next").addEventListener("click", () => openLightbox((lbIndex + 1) % photos.length));
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox((lbIndex - 1 + photos.length) % photos.length);
    if (e.key === "ArrowRight") openLightbox((lbIndex + 1) % photos.length);
  });

  /* Countdown */
  const target = cfg.wedding.dateISO ? new Date(cfg.wedding.dateISO) : null;
  const msg = document.getElementById("countdown-message");
  const gridCount = document.getElementById("countdown-grid");

  function tick() {
    if (!target || Number.isNaN(target.getTime())) {
      gridCount.hidden = true;
      msg.hidden = false;
      msg.textContent = "The celebration awaits.";
      return;
    }
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
      gridCount.hidden = true;
      msg.hidden = false;
      msg.textContent = "The celebration is here. With love, Pranav & Anuja.";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    document.getElementById("d").textContent = pad(days);
    document.getElementById("h").textContent = pad(hours);
    document.getElementById("m").textContent = pad(mins);
    document.getElementById("s").textContent = pad(secs);
  }
  tick();
  const timer = setInterval(tick, 1000);
  window.addEventListener("beforeunload", () => clearInterval(timer));

  /* Scroll reveals */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.16 }
  );
  document.querySelectorAll(".in-view").forEach((el) => observer.observe(el));

  const heroImg = document.querySelector("[data-parallax] img");
  if (heroImg && !reduced) {
    window.addEventListener(
      "scroll",
      () => {
        heroImg.style.transform = "translateY(" + window.scrollY * 0.12 + "px) scale(1.06)";
      },
      { passive: true }
    );
  }

  /* Music — original tanpura-like drone via Web Audio, no copyrighted file */
  const music = {
    ctx: null,
    nodes: [],
    playing: false,
    muted: false,
    play() {
      try {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === "suspended") this.ctx.resume();
        if (this.playing) {
          this.updateUi();
          return;
        }
        const master = this.ctx.createGain();
        master.gain.value = this.muted ? 0 : 0.045;
        master.connect(this.ctx.destination);
        const freqs = [130.81, 196.0, 261.63];
        this.nodes = freqs.map((freq, i) => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = i === 0 ? "sine" : "triangle";
          osc.frequency.value = freq;
          g.gain.value = i === 0 ? 0.9 : 0.25;
          osc.connect(g);
          g.connect(master);
          osc.start();
          return osc;
        });
        this.master = master;
        this.playing = true;
        this.updateUi();
      } catch {
        this.playing = false;
        this.updateUi();
      }
    },
    pause() {
      this.nodes.forEach((n) => {
        try {
          n.stop();
        } catch {}
      });
      this.nodes = [];
      this.playing = false;
      this.updateUi();
    },
    toggle() {
      this.playing ? this.pause() : this.play();
    },
    toggleMute() {
      this.muted = !this.muted;
      if (this.master) this.master.gain.value = this.muted ? 0 : 0.045;
      this.updateUi();
    },
    updateUi() {
      const playBtn = document.getElementById("music-toggle");
      const muteBtn = document.getElementById("music-mute");
      playBtn.setAttribute("aria-pressed", String(this.playing));
      playBtn.setAttribute("aria-label", this.playing ? "Pause music" : "Play music");
      muteBtn.setAttribute("aria-pressed", String(this.muted));
    },
  };
  document.getElementById("music-toggle").addEventListener("click", () => music.toggle());
  document.getElementById("music-mute").addEventListener("click", () => music.toggleMute());
  window.addEventListener("beforeunload", () => music.pause());

  /* RSVP */
  const form = document.getElementById("rsvp-form");
  const status = document.getElementById("rsvp-status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.className = "form-status";
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const attendance = String(data.get("attendance") || "accepts");
    const attendees = Number(data.get("attendees") || 1);
    const dietaryPref = String(data.get("dietary") || "");
    const message = String(data.get("message") || "").trim();
    const eventIds = data.getAll("eventIds");

    if (name.length < 2) {
      status.textContent = "Please enter your full name.";
      status.classList.add("is-error");
      return;
    }
    if (!window.PAStore.isValidIndianPhone(phone)) {
      status.textContent = "Please enter a valid 10-digit mobile number.";
      status.classList.add("is-error");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = "Please enter a valid email, or leave it blank.";
      status.classList.add("is-error");
      return;
    }
    if (attendees < 1 || attendees > (cfg.rsvp.maxAttendees || 8)) {
      status.textContent = "Please choose a valid number of attendees.";
      status.classList.add("is-error");
      return;
    }
    if (!window.PAStore.canSubmit(8000)) {
      status.textContent = "Please wait a moment before sending another response.";
      status.classList.add("is-error");
      return;
    }

    try {
      const existing = window.PAStore.findRsvpByPhone(phone);
      const record = window.PAStore.saveRsvp({
        name,
        phone,
        email,
        attendance,
        attendees: attendance === "declines" ? 0 : attendees,
        dietary: dietaryPref,
        message,
        eventIds,
      });
      if (data.get("wishPublic") && message) {
        window.PAStore.saveWish({
          id: crypto.randomUUID(),
          name,
          message,
          published: false,
          createdAt: new Date().toISOString(),
        });
      }
      window.PAStore.markSubmit();
      form.classList.add("is-hidden");
      document.getElementById("rsvp-success").classList.add("is-visible");
      status.textContent = existing
        ? "Your earlier response has been updated."
        : "";
      return record;
    } catch {
      status.textContent = "We could not save your response. Please try again.";
      status.classList.add("is-error");
    }
  });

  /* Wishes */
  const publishedWishes = window.PAStore.getWishes().filter((w) => w.published);
  const wishesList = document.getElementById("wishes-list");
  if (!publishedWishes.length) {
    wishesList.innerHTML = '<p class="empty">Blessings from our guests will appear here after they are shared.</p>';
  } else {
    wishesList.innerHTML = publishedWishes
      .map(
        (w) => `
        <article class="event-card">
          <div class="event-card__body">
            <h3>${w.name}</h3>
            <p>${w.message}</p>
          </div>
        </article>`
      )
      .join("");
  }

  /* Share + QR */
  function shareMessage() {
    const url = invitationUrl();
    const lines = [
      `With immense joy, we invite you to celebrate the wedding of ${cfg.couple.displayName}.`,
      cfg.wedding.dateLabel ? `Date: ${cfg.wedding.dateLabel}` : "",
      cfg.venue.name ? `Venue: ${cfg.venue.name}, ${cfg.venue.address}` : "",
      url ? `View the invitation and celebration details here: ${url}` : "",
      "We look forward to celebrating with you!",
    ].filter(Boolean);
    return lines.join("\n\n");
  }

  const shareStatus = document.getElementById("share-status");
  document.getElementById("whatsapp-share").addEventListener("click", () => {
    const url = "https://wa.me/?text=" + encodeURIComponent(shareMessage());
    window.open(url, "_blank", "noopener");
  });
  document.getElementById("copy-link").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl() || shareMessage());
      shareStatus.textContent = "Invitation link copied.";
      shareStatus.className = "form-status is-ok";
    } catch {
      shareStatus.textContent = "Copy is unavailable in this browser.";
      shareStatus.className = "form-status is-error";
    }
  });
  const nativeShare = document.getElementById("native-share");
  if (!navigator.share) nativeShare.hidden = true;
  nativeShare.addEventListener("click", async () => {
    try {
      await navigator.share({
        title: cfg.wedding.title,
        text: shareMessage(),
        url: invitationUrl() || undefined,
      });
    } catch {}
  });

  function buildQr(url) {
    const target = document.getElementById("qr-target");
    target.innerHTML = "";
    if (!url) {
      target.innerHTML =
        '<p class="empty">A scannable QR code will appear here after the invitation is published on the web.</p>';
      return null;
    }
    const qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();
    target.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 4, scalable: true });
    const svg = target.querySelector("svg");
    if (svg) {
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "QR code for the wedding invitation");
    }
    return qr;
  }

  const qrUrl = invitationUrl();
  const qr = buildQr(qrUrl && !qrUrl.startsWith("file:") ? qrUrl : "");

  document.getElementById("download-qr-svg").addEventListener("click", () => {
    const svg = document.querySelector("#qr-target svg");
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pranav-anuja-invitation-qr.svg";
    a.click();
  });

  document.getElementById("download-qr-png").addEventListener("click", () => {
    if (!qr) return;
    const size = qr.getModuleCount();
    const cell = 8;
    const margin = 4;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = (size + margin * 2) * cell;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#F8F2E8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#3D101B";
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (qr.isDark(r, c)) ctx.fillRect((c + margin) * cell, (r + margin) * cell, cell, cell);
      }
    }
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "pranav-anuja-invitation-qr.png";
    a.click();
  });

  document.getElementById("print-card").addEventListener("click", () => window.print());
})();
