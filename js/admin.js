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
      status.textContent = "Incorrect password.";
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
      <div class="stat"><b>${rsvps.length}</b><span>Total RSVPs</span></div>
      <div class="stat"><b>${accepts.length}</b><span>Attending</span></div>
      <div class="stat"><b>${declines.length}</b><span>Unable to attend</span></div>
      <div class="stat"><b>${attendees}</b><span>Confirmed guests</span></div>
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
          <td>${r.attendance === "accepts" ? "Attending" : "Unable to attend"}</td>
          <td>${r.attendees}</td>
          <td>${(r.eventIds || []).map((id) => (cfg.events || []).find((event) => event.id === id)?.title || id).join(", ")}</td>
          <td>${new Date(r.createdAt).toLocaleString("en-IN")}</td>
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
              <p class="event-meta">${w.published ? "Published" : "Pending review"}</p>
              <button class="btn btn--dark" data-wish="${w.id}" type="button">
                ${w.published ? "Unpublish" : "Publish"}
              </button>
            </div>
          </article>`
          )
          .join("")
      : '<p class="empty">No guest wishes have been shared yet.</p>';

    const url = location.origin + location.pathname.replace(/admin\.html.*/, "index.html");
    document.getElementById("wa-preview").value = [
      `You are warmly invited to celebrate the wedding of ${cfg.couple.displayName}.`,
      `Date: ${cfg.wedding.dateLabel}`,
      `Venue: ${cfg.venue.name}, ${cfg.venue.address}`,
      `View the invitation: ${url}`,
      "We look forward to celebrating with you!",
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
    const header = ["Name", "Phone", "Email", "Attendance", "Guests", "Dietary preference", "Events", "Message", "Submitted on"];
    const lines = [header.join(",")].concat(
      rsvps.map((r) =>
        [
          r.name,
          r.phone,
          r.email,
          r.attendance === "accepts" ? "Attending" : "Unable to attend",
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
    a.download = "pranav-anuja-rsvps.csv";
    a.click();
  });

  if (authed()) showDash();
})();
