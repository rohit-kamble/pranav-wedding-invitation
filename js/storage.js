(function (window) {
  const KEYS = {
    rsvps: "pa_rsvps",
    wishes: "pa_wishes",
    settings: "pa_settings_override",
    lastSubmit: "pa_rsvp_last",
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function mergeConfig() {
    const base = window.WEDDING || {};
    const override = read(KEYS.settings, {});
    return {
      ...base,
      ...override,
      couple: { ...base.couple, ...(override.couple || {}) },
      wedding: { ...base.wedding, ...(override.wedding || {}) },
      venue: { ...base.venue, ...(override.venue || {}) },
      events: override.events || base.events || [],
      story: override.story || base.story || [],
      gallery: override.gallery || base.gallery || [],
      rsvp: { ...base.rsvp, ...(override.rsvp || {}) },
    };
  }

  function normalizePhone(phone) {
    const digits = String(phone || "").replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
    return digits;
  }

  function isValidIndianPhone(phone) {
    return /^[6-9]\d{9}$/.test(normalizePhone(phone));
  }

  function canSubmit(limitMs) {
    const last = Number(localStorage.getItem(KEYS.lastSubmit) || 0);
    return Date.now() - last > (limitMs || 8000);
  }

  function markSubmit() {
    localStorage.setItem(KEYS.lastSubmit, String(Date.now()));
  }

  function getRsvps() {
    return read(KEYS.rsvps, []);
  }

  function saveRsvp(entry) {
    const list = getRsvps();
    const phone = normalizePhone(entry.phone);
    const existing = list.findIndex((item) => item.phone === phone);
    const record = {
      ...entry,
      phone,
      id: existing >= 0 ? list[existing].id : crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      createdAt: existing >= 0 ? list[existing].createdAt : new Date().toISOString(),
    };
    if (existing >= 0) list[existing] = record;
    else list.unshift(record);
    write(KEYS.rsvps, list);
    return record;
  }

  function findRsvpByPhone(phone) {
    return getRsvps().find((item) => item.phone === normalizePhone(phone));
  }

  function getWishes() {
    return read(KEYS.wishes, []);
  }

  function saveWish(wish) {
    const list = getWishes();
    list.unshift(wish);
    write(KEYS.wishes, list);
    return wish;
  }

  function setWishes(list) {
    write(KEYS.wishes, list);
  }

  function setRsvps(list) {
    write(KEYS.rsvps, list);
  }

  function saveSettings(settings) {
    write(KEYS.settings, settings);
  }

  window.PAStore = {
    KEYS,
    mergeConfig,
    normalizePhone,
    isValidIndianPhone,
    canSubmit,
    markSubmit,
    getRsvps,
    saveRsvp,
    findRsvpByPhone,
    getWishes,
    saveWish,
    setWishes,
    setRsvps,
    saveSettings,
  };
})(window);
