/**
 * Wedding configuration for Pranav & Anuja.
 * Edit this file (or use the admin dashboard) to update invitation details.
 */
window.WEDDING = {
  couple: {
    displayName: "Pranav & Anuja",
    groom: "Pranav",
    bride: "Anuja",
    monogram: "PA",
    headline: "A Royal Celebration of Love",
    tagline: "Two Hearts. One Beautiful Journey.",
    quote: "Some moments become memories. Some memories become forever.",
    blessingHindi: "शुभ विवाह",
    blessingSanskrit: "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके",
    intro:
      "With the blessings of our families, we invite you to witness our wedding and to celebrate a lifetime of love, faith, and togetherness.",
  },

  wedding: {
    title: "Pranav & Anuja — A Royal Wedding Invitation",
    dateISO: "2026-11-14T11:00:00+05:30",
    timezone: "Asia/Kolkata",
    dateLabel: "14 November 2026",
    timeLabel: "11:00 AM onwards",
    dayLabel: "Saturday",
  },

  venue: {
    name: "Royal Palace Mangal Hall",
    address: "Nigadi, Taluka Jath, Dist. Sangali",
    city: "Jath, Sangali",
    region: "Maharashtra",
    mapsQuery: "Royal Palace Mangal Hall, Nigadi, Taluka Jath, Dist Sangali",
    parking: "",
    accommodation: "",
    contact: "",
  },

  publicUrl: "https://rohit-kamble.github.io/pranav-wedding-invitation/",

  events: [
    {
      id: "wedding-ceremony",
      title: "Wedding Ceremony",
      description: "Join us as we begin our married life with sacred vows, blessings, and celebration.",
      date: "2026-11-14",
      start: "11:00",
      end: "",
      venue: "Royal Palace Mangal Hall",
      address: "Nigadi, Taluka Jath, Dist. Sangali",
      dressCode: "Traditional / festive attire",
      image: "images/couple-portrait.jpg",
      published: true,
    },
  ],

  story: [
    {
      id: "together",
      title: "Together",
      date: "",
      description: "Two hearts, one journey — a portrait of Pranav and Anuja.",
      image: "images/couple-portrait.jpg",
      published: true,
    },
    {
      id: "promise",
      title: "A Promise in Gold",
      date: "",
      description: "Rings held with mehendi-adorned hands — a quiet moment before forever.",
      image: "images/rings.jpg",
      published: true,
    },
    {
      id: "hand-in-hand",
      title: "Hand in Hand",
      date: "",
      description: "Walking forward together, with joy in every step.",
      image: "images/couple-walk.jpg",
      published: true,
    },
    {
      id: "wedding-day",
      title: "The Wedding Celebration",
      date: "14 November 2026",
      description: "We look forward to celebrating our wedding with you at Royal Palace Mangal Hall.",
      image: "images/couple-walk.jpg",
      published: true,
    },
  ],

  gallery: [
    {
      id: "g1",
      src: "images/couple-portrait.jpg",
      alt: "Pranav and Anuja standing together in white",
      caption: "Pranav & Anuja",
      category: "Couple",
      published: true,
    },
    {
      id: "g2",
      src: "images/rings.jpg",
      alt: "Mehendi-adorned hands holding wedding rings",
      caption: "Rings of promise",
      category: "Engagement",
      published: true,
    },
    {
      id: "g3",
      src: "images/couple-walk.jpg",
      alt: "Pranav and Anuja walking hand in hand",
      caption: "Hand in hand",
      category: "Memories",
      published: true,
    },
  ],

  galleryCategories: ["All", "Couple", "Engagement", "Family", "Celebrations", "Memories"],

  rsvp: {
    maxAttendees: 8,
    dietaryOptions: ["No preference", "Vegetarian", "Jain", "Vegan", "Other"],
  },

  admin: {
    /**
     * Client-side passphrase for the local admin dashboard.
     * This is not production-grade security. Change it before sharing the site.
     */
    passphrase: "pranav-anuja-2026",
  },

  seo: {
    description:
      "You are cordially invited to the wedding of Pranav and Anuja on 14 November 2026 at Royal Palace Mangal Hall, Nigadi, Taluka Jath, Dist. Sangali.",
  },
};
