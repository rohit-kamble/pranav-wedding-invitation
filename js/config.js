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
    headline: "A royal celebration of love",
    tagline: "Two hearts, one beautiful journey",
    quote: "Some moments become memories; some memories become forever.",
    blessingHindi: "With the blessings of our families",
    blessingSanskrit: "Love, laughter, and a lifetime together",
    intro:
      "With the blessings of our families, we invite you to join us as we begin a new journey of love, trust, and togetherness.",
  },

  wedding: {
    title: "Pranav & Anuja — A Royal Wedding Invitation",
    dateISO: "2026-11-14T12:00:00+05:30",
    timezone: "Asia/Kolkata",
    dateLabel: "14 November 2026",
    timeLabel: "12:00 PM onwards",
    dayLabel: "Saturday",
  },

  venue: {
    name: "Royal Palace Mangal Hall",
    address: "Nigadi, Jath Taluka, Sangli District",
    city: "Jath, Sangli",
    region: "Maharashtra",
    mapsQuery: "Royal Palace Mangal Hall, Nigadi, Taluka Jath, Dist Sangali",
    parking: "",
    accommodation: "",
    contact: "",
  },

  publicUrl: "https://rohit-kamble.github.io/pranav-wedding-invitation/?v=4",

  events: [
    {
      id: "haldi-ceremony",
      title: "Haldi Ceremony",
      description: "You and your family are warmly invited to join this joyful celebration.",
      date: "2026-11-13",
      dateLabel: "13 November 2026",
      start: "",
      end: "",
      venue: "Konikunur",
      address: "Jath Taluka, Sangli District",
      mapsQuery: "Konikunur, Taluka Jath, Sangli",
      dressCode: "",
      image: "images/couple-portrait.jpg",
      published: true,
    },
    {
      id: "wedding-ceremony",
      title: "Wedding Ceremony",
      description: "Join us for blessings, joyful celebrations, and the beginning of our life together.",
      date: "2026-11-14",
      dateLabel: "14 November 2026",
      start: "12:00",
      end: "",
      venue: "Royal Palace Mangal Hall",
      address: "Nigadi, Jath Taluka, Sangli District",
      dressCode: "Traditional or festive attire",
      image: "images/couple-portrait.jpg",
      published: true,
    },
    {
      id: "reception",
      title: "Reception",
      description: "You and your family are warmly invited to celebrate with us.",
      date: "2026-11-20",
      dateLabel: "20 November 2026",
      start: "",
      end: "",
      venue: "Majesty B2 · Lower Ground Floor",
      address: "Near Pink City, Ambernath East",
      mapsQuery: "Lower Ground Floor, Majesty B2, near Pink City, Ambernath East",
      dressCode: "",
      image: "images/couple-walk.jpg",
      published: true,
    },
  ],

  story: [
    {
      id: "together",
      title: "Together",
      date: "",
      description: "Two hearts, one beautiful journey, and countless memories to cherish. Every moment is special as we begin this new chapter with love, trust, and companionship. Join Pranav and Anuja in celebrating this joyful beginning.",
      image: "images/couple-portrait.jpg",
      published: true,
    },
    {
      id: "promise",
      title: "A Promise in Gold",
      date: "",
      description: "Held in mehndi-adorned hands, these rings symbolize love, trust, and a promise to stand by each other for a lifetime. This quiet moment carries the joy of a beautiful new beginning.",
      image: "images/rings.jpg",
      published: true,
    },
    {
      id: "wedding-day",
      title: "The Wedding Celebration",
      date: "14 November 2026",
      description: "Our wedding will take place on 14 November 2026 at Royal Palace Mangal Hall. The blessings of our families and the presence of our loved ones will make the day even more special. Please join us with your family and bless our new beginning.",
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
      category: "The couple",
      published: true,
    },
    {
      id: "g2",
      src: "images/rings.jpg",
      alt: "Mehndi-adorned hands holding wedding rings",
      caption: "Rings of Promise",
      category: "Engagement",
      published: true,
    },
    {
      id: "g3",
      src: "images/couple-walk.jpg",
      alt: "Pranav and Anuja walking hand in hand",
      caption: "Hand in Hand",
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
      "You are warmly invited to celebrate the wedding of Pranav and Anuja on 14 November 2026 at Royal Palace Mangal Hall, Nigadi, Jath Taluka, Sangli District.",
  },
};
