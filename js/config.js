/* ===========================================================
   AFZAAN MANDI — EDIT THIS FILE TO UPDATE THE WHOLE WEBSITE
   Anything left as "" or null shows a clearly marked placeholder.
   Put your photos in the /images folder and set the paths below,
   e.g.  image: "images/chicken-mandi.jpg"  (use small JPG/WebP files, ~200 KB each)
   =========================================================== */
window.SITE = {
  name: "Afzaan Mandi Restaurant",
  tagline: "The Royal Taste of Mandi",
  subtitle: "Experience the Authentic Taste of Arabian Cuisine.",

  // Verified from Google Maps listing
  rating: 4.8,
  reviewCount: 2262,

  // ---- Fill these in with REAL details ----
  phone: "",            // e.g. "+919876543210"  (enables Call Now + WhatsApp orders)
  whatsapp: "",         // e.g. "919876543210" (digits only, with country code)
  email: "",            // e.g. "hello@afzaanmandi.com"
  address: "",          // full address once confirmed
  hours: [              // set real timings; leave time "" to show placeholder
    { day: "Monday",    time: "" },
    { day: "Tuesday",   time: "" },
    { day: "Wednesday", time: "" },
    { day: "Thursday",  time: "" },
    { day: "Friday",    time: "" },
    { day: "Saturday",  time: "" },
    { day: "Sunday",    time: "" }
  ],
  // Paste the "Share → Copy link" URL from Google Maps for exact links:
  googleMapsUrl: "",    // place link (used by Get Directions)
  googleReviewsUrl: "", // reviews link (used by Read Google Reviews)
  mapEmbedUrl: "",      // optional: Share → Embed a map → src="..." value
  instagram: "",        // full URL
  facebook: "",
  currency: "₹",

  // Hero / About / Gallery photos (leave "" to show elegant placeholder)
  images: {
    about: "",
    gallery: [
      { label: "Restaurant Interior",  src: "" },
      { label: "Signature Mandi",      src: "" },
      { label: "Dining Experience",    src: "" },
      { label: "Food Preparation",     src: "" },
      { label: "Restaurant Atmosphere",src: "" },
      { label: "Grilled Specialties",  src: "" }
    ]
  },

  // ---- MENU ----
  // price: number (e.g. 350) or null for "Price on request".
  // Replace every placeholder item with your real dishes.
  menu: {
    "Chicken Mandi":    [ { name: "Chicken Mandi — Item 1", desc: "Add dish description here.", price: null, image: "" },
                          { name: "Chicken Mandi — Item 2", desc: "Add dish description here.", price: null, image: "" } ],
    "Mutton Mandi":     [ { name: "Mutton Mandi — Item 1",  desc: "Add dish description here.", price: null, image: "" },
                          { name: "Mutton Mandi — Item 2",  desc: "Add dish description here.", price: null, image: "" } ],
    "Special Mandi":    [ { name: "Special Mandi — Item 1", desc: "Add dish description here.", price: null, image: "" },
                          { name: "Special Mandi — Item 2", desc: "Add dish description here.", price: null, image: "" } ],
    "Arabian Starters": [ { name: "Starter — Item 1",       desc: "Add dish description here.", price: null, image: "" },
                          { name: "Starter — Item 2",       desc: "Add dish description here.", price: null, image: "" } ],
    "Grilled Chicken":  [ { name: "Grilled Chicken — Item 1", desc: "Add dish description here.", price: null, image: "" },
                          { name: "Grilled Chicken — Item 2", desc: "Add dish description here.", price: null, image: "" } ],
    "Beverages":        [ { name: "Beverage — Item 1",      desc: "Add description here.",      price: null, image: "" },
                          { name: "Beverage — Item 2",      desc: "Add description here.",      price: null, image: "" } ]
  }
};
