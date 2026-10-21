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

  /* Opening sequence */
  const gate = document.getElementById("gate");
  let gateLeaving = false;
  let invitationOpening = false;

  function closeGate() {
    if (gateLeaving) return;
    gateLeaving = true;
    document.body.classList.remove("is-locked");
    document.body.classList.add("has-opened-invite");
    gate.classList.add("is-leaving");
    setTimeout(() => {
      gate.style.display = "none";
    }, reduced ? 0 : 900);
  }

  function openInvitation(withMusic) {
    if (invitationOpening || gateLeaving) return;
    invitationOpening = true;
    gate.classList.add("is-bloom");
    if (withMusic) music.play();
    setTimeout(closeGate, reduced ? 0 : 2600);
  }

  document.getElementById("open-invite").addEventListener("click", () => openInvitation(true));
  document.getElementById("skip-intro").addEventListener("click", closeGate);
  if (!reduced) setTimeout(() => openInvitation(false), 8000);
  if (reduced) closeGate();

  /* Nav */
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
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

  /* Background music from the project assets */
  const audio = document.getElementById("background-music");
  audio.pause();
  audio.currentTime = 0;
  audio.src =
    "assets/" +
    encodeURIComponent(
      "Jaymangal asthagatha_ jaimangal Atthagatha buddha vandana, buddha pooja #viralsong [LXwF2eQX2ow].mp3"
    );
  audio.volume = 1;
  audio.muted = false;
  audio.load();
  let manuallyPaused = false;
  const music = {
    playing: true,
    play() {
      manuallyPaused = false;
      this.playing = true;
      this.updateUi();
      audio
        .play()
        .then(() => {
          this.playing = true;
          this.updateUi();
        })
        .catch(() => {
          if (audio.paused) {
            this.playing = false;
            this.updateUi();
          }
        });
    },
    pause(manual = false) {
      audio.pause();
      if (manual) manuallyPaused = true;
      this.playing = false;
      this.updateUi();
    },
    toggle() {
      audio.paused ? this.play() : this.pause(true);
    },
    updateUi() {
      const playBtn = document.getElementById("music-toggle");
      playBtn.setAttribute("aria-pressed", String(this.playing));
      playBtn.setAttribute("aria-label", this.playing ? "Pause music" : "Play music");
      playBtn.textContent = this.playing ? "Ⅱ" : "♪";
    },
  };
  function resumeAfterGesture(event) {
    if (event.target.closest && event.target.closest("#music-toggle")) return;
    window.removeEventListener("pointerdown", resumeAfterGesture);
    window.removeEventListener("keydown", resumeAfterGesture);
    if (!manuallyPaused) music.play();
  }
  window.addEventListener("pointerdown", resumeAfterGesture);
  window.addEventListener("keydown", resumeAfterGesture);
  document.getElementById("music-toggle").addEventListener("click", () => music.toggle());
  window.addEventListener("beforeunload", () => music.pause());
  music.updateUi();
  music.play();

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
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Open the online wedding invitation");
    link.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 4, scalable: true });
    target.replaceChildren(link);
    const svg = link.querySelector("svg");
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
