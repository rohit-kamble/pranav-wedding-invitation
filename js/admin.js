(function () {
  const SESSION = "pa_admin_session";
  const cfg = window.PAStore.mergeConfig();

  const loginView = document.getElementById("login-view");
  const dashView = document.getElementById("dash-view");

  function authed() {
    return sessionStorage.getItem(SESSION) === "ok";
  }

  function showDash() {
    loginView.hidden = true;
    loginView.style.display = "none";
    dashView.hidden = false;
    render();
  }

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = new FormData(e.target).get("pass");
    const status = document.getElementById("login-status");
    if (pass === cfg.admin.passphrase) {
      sessionStorage.setItem(SESSION, "ok");
      showDash();
    } else {
      status.textContent = "संकेतशब्द चुकीचा आहे.";
      status.className = "form-status is-error";
    }
  });

  document.getElementById("signout").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION);
    location.reload();
  });

  function csvEscape(value) {
    const text = String(value ?? "");
    if (/[",\n]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
    return text;
  }

  function render() {
    const rsvps = window.PAStore.getRsvps();
    const accepts = rsvps.filter((r) => r.attendance === "accepts");
    const declines = rsvps.filter((r) => r.attendance === "declines");
    const attendees = accepts.reduce((sum, r) => sum + Number(r.attendees || 0), 0);
    const events = (cfg.events || []).filter((e) => e.published);

    document.getElementById("stats").innerHTML = `
      <div class="stat"><b>${rsvps.length}</b><span>एकूण उत्तरे</span></div>
      <div class="stat"><b>${accepts.length}</b><span>उपस्थित राहणार</span></div>
      <div class="stat"><b>${declines.length}</b><span>उपस्थित राहू शकणार नाही</span></div>
      <div class="stat"><b>${attendees}</b><span>निश्चित पाहुणे</span></div>
      ${events
        .map((ev) => {
          const count = accepts.filter((r) => (r.eventIds || []).includes(ev.id)).length;
          return `<div class="stat"><b>${count}</b><span>${ev.title}</span></div>`;
        })
        .join("")}
    `;

    const q = document.getElementById("search").value.trim().toLowerCase();
    const filter = document.getElementById("filter").value;
    const rows = rsvps.filter((r) => {
      const matchName = !q || String(r.name).toLowerCase().includes(q);
      const matchFilter = filter === "all" || r.attendance === filter;
      return matchName && matchFilter;
    });

    document.getElementById("rsvp-body").innerHTML = rows
      .map(
        (r) => `
        <tr>
          <td>${r.name}</td>
          <td>${r.phone}</td>
          <td>${r.attendance === "accepts" ? "उपस्थित राहणार" : "उपस्थित राहू शकणार नाही"}</td>
          <td>${r.attendees}</td>
          <td>${(r.eventIds || []).map((id) => (cfg.events || []).find((event) => event.id === id)?.title || id).join(", ")}</td>
          <td>${new Date(r.createdAt).toLocaleString("mr-IN")}</td>
        </tr>`
      )
      .join("");

    const wishes = window.PAStore.getWishes();
    document.getElementById("wish-list").innerHTML = wishes.length
      ? wishes
          .map(
            (w) => `
          <article class="event-card" style="margin-top:12px">
            <div class="event-card__body">
              <h3>${w.name}</h3>
              <p>${w.message}</p>
              <p class="event-meta">${w.published ? "प्रकाशित" : "पडताळणी बाकी"}</p>
              <button class="btn btn--dark" data-wish="${w.id}" type="button">
                ${w.published ? "प्रकाशन काढा" : "प्रकाशित करा"}
              </button>
            </div>
          </article>`
          )
          .join("")
      : '<p class="empty">अजून पाहुण्यांच्या शुभेच्छा आलेल्या नाहीत.</p>';

    const url = location.origin + location.pathname.replace(/admin\.html.*/, "index.html");
    document.getElementById("wa-preview").value = [
      `${cfg.couple.displayName} यांच्या विवाहसोहळ्यास आपणांस सस्नेह निमंत्रण.`,
      `दिनांक: ${cfg.wedding.dateLabel}`,
      `स्थळ: ${cfg.venue.name}, ${cfg.venue.address}`,
      `निमंत्रण येथे पहा: ${url}`,
      "आपल्यासोबत हा आनंद साजरा करण्यास आम्ही उत्सुक आहोत!",
    ].join("\n\n");
  }

  document.getElementById("search").addEventListener("input", render);
  document.getElementById("filter").addEventListener("change", render);
  document.getElementById("wish-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-wish]");
    if (!btn) return;
    const list = window.PAStore.getWishes().map((w) =>
      w.id === btn.dataset.wish ? { ...w, published: !w.published } : w
    );
    window.PAStore.setWishes(list);
    render();
  });

  document.getElementById("export").addEventListener("click", () => {
    const rsvps = window.PAStore.getRsvps();
    const header = ["नाव", "दूरध्वनी", "ईमेल", "उपस्थिती", "पाहुणे", "आहार", "सोहळे", "संदेश", "नोंद दिनांक"];
    const lines = [header.join(",")].concat(
      rsvps.map((r) =>
        [
          r.name,
          r.phone,
          r.email,
          r.attendance === "accepts" ? "उपस्थित राहणार" : "उपस्थित राहू शकणार नाही",
          r.attendees,
          r.dietary,
          (r.eventIds || []).join("|"),
          r.message,
          r.createdAt,
        ]
          .map(csvEscape)
          .join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pranav-anuja-upasthiti.csv";
    a.click();
  });

  if (authed()) showDash();
})();
