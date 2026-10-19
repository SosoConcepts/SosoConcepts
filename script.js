const business = {
  name: "SosoConcepts",
  phone: "09134612312",
  whatsapp: "2349134612312",
  email: "ibrahimibrahimsoso6@gmail.com",
  address: "Shop No. 1, Kampany, opposite Shaba Street, Hayin Mallan Bello"
};

const categories = [
  {
    id: "print",
    title: "Print & documents",
    eyebrow: "PAPERWORK, POLISHED",
    icon: "▤",
    description: "From a quick copy to a finished print job, get your documents ready.",
    services: [
      "Photocopy", "Colour printing", "Black & white printing", "Scanning", "Typesetting",
      "Lamination", "Document binding", "Business cards", "Invitation cards", "Flex banners",
      "Tarpaulins"
    ]
  },
  {
    id: "creative",
    title: "Design & creativity",
    eyebrow: "MADE TO MAKE YOU NOTICE",
    icon: "✳",
    description: "Bring your ideas to life with custom visuals and creative editing.",
    services: [
      "Graphic design", "Custom designs", "T-shirt design", "Photo editing",
      "Video editing", "Photo restoration"
    ]
  },
  {
    id: "online",
    title: "Online services",
    eyebrow: "A HAND WITH THE ONLINE STUFF",
    icon: "↗",
    description: "Get assistance with online registrations, bookings, and applications.",
    services: [
      "CAC", "NAFDAC", "JAMB", "NECO", "WAEC", "BVN / NIN", "FIRS / TIN", "NIMC",
      "Hotel booking", "Flight booking", "Business permit", "Pension / NHF", "NERC / DPR"
    ]
  },
  {
    id: "photos",
    title: "Passport photos",
    eyebrow: "PHOTO-READY",
    icon: "▣",
    description: "Passport photo and photoshoot services for your document needs.",
    services: ["Passport photos", "Passport photoshoot"]
  },
  {
    id: "training",
    title: "Training & learning",
    eyebrow: "SKILLS FOR WHAT'S NEXT",
    icon: "⌘",
    description: "Build confidence with practical technology, creativity, and business skills.",
    services: [
      "Basic computer", "Graphic design training", "AI learning", "SME business",
      "Digital marketing", "Leadership", "Photo & video editing training",
      "Workplace safety", "Personal development"
    ]
  },
  {
    id: "computer",
    title: "Computer services",
    eyebrow: "HERE WHEN YOU NEED A HAND",
    icon: "⌘",
    description: "Ask us about the computer-related task you need help with.",
    services: ["Computer services"]
  }
];

const filters = document.querySelector("#service-filters");
const grid = document.querySelector("#service-grid");
const search = document.querySelector("#service-search");
const resultCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const inquiryForm = document.querySelector("#inquiry-form");
const serviceSelect = inquiryForm.elements.service;

const allServices = categories.flatMap((category) => category.services);

let activeCategory = "all";

function normalize(value) {
  return value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function createWhatsAppLink(message) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}

function renderFilters() {
  const buttons = [
    { id: "all", title: "All services", count: allServices.length },
    ...categories.map((category) => ({
      id: category.id,
      title: category.title,
      count: category.services.length
    }))
  ];

  filters.replaceChildren(...buttons.map((filter) => {
    const button = document.createElement("button");
    button.className = `filter-button${filter.id === activeCategory ? " is-active" : ""}`;
    button.type = "button";
    button.dataset.filter = filter.id;
    button.setAttribute("aria-pressed", String(filter.id === activeCategory));
    button.textContent = filter.title;
    const count = document.createElement("span");
    count.textContent = String(filter.count).padStart(2, "0");
    button.append(count);
    button.addEventListener("click", () => {
      activeCategory = filter.id;
      renderFilters();
      renderServices();
    });
    return button;
  }));
}

function createServiceCard(category, visibleServices) {
  const article = document.createElement("article");
  article.className = "service-card";
  article.dataset.category = category.id;

  const header = document.createElement("div");
  header.className = "service-card-top";
  const icon = document.createElement("span");
  icon.className = "service-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = category.icon;
  const eyebrow = document.createElement("span");
  eyebrow.className = "service-eyebrow";
  eyebrow.textContent = category.eyebrow;
  header.append(icon, eyebrow);

  const title = document.createElement("h3");
  title.textContent = category.title;
  const description = document.createElement("p");
  description.className = "service-description";
  description.textContent = category.description;
  const pills = document.createElement("div");
  pills.className = "service-tags";

  visibleServices.forEach((service) => {
    const link = document.createElement("a");
    link.className = "service-tag";
    link.href = createWhatsAppLink(`Hello ${business.name}, I would like to ask about ${service}.`);
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = service;
    link.setAttribute("aria-label", `Ask SosoConcepts about ${service} on WhatsApp`);
    pills.append(link);
  });

  article.append(header, title, description, pills);
  return article;
}

function renderServices() {
  const query = normalize(search.value.trim());
  let matchCount = 0;
  const cards = [];

  categories.forEach((category) => {
    if (activeCategory !== "all" && category.id !== activeCategory) return;
    const matches = category.services.filter((service) => (
      !query || normalize(`${service} ${category.title} ${category.description}`).includes(query)
    ));
    if (matches.length) {
      matchCount += matches.length;
      cards.push(createServiceCard(category, matches));
    }
  });

  grid.replaceChildren(...cards);
  resultCount.textContent = `${matchCount} ${matchCount === 1 ? "service" : "services"}${query ? " found" : " to explore"}`;
  emptyState.hidden = matchCount > 0;
}

renderFilters();
renderServices();
search.addEventListener("input", renderServices);

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    search.focus();
  }
  if (event.key === "Escape" && document.activeElement === search) {
    search.value = "";
    renderServices();
    search.blur();
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    siteNav.classList.remove("is-open");
  });
});

document.querySelectorAll("[data-training]").forEach((button) => {
  button.addEventListener("click", () => {
    serviceSelect.value = button.dataset.training;
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
    serviceSelect.focus({ preventScroll: true });
  });
});

serviceSelect.replaceChildren(new Option("Choose a service…", ""));
allServices.forEach((service) => serviceSelect.add(new Option(service, service)));

inquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedService = serviceSelect.value;
  const notes = inquiryForm.elements.notes.value.trim();
  const message = [
    `Hello ${business.name},`,
    selectedService ? `I would like to ask about ${selectedService}.` : "I would like to ask about your services.",
    notes ? `\n${notes}` : "",
    "\nPlease let me know how you can help. Thank you!"
  ].join("");
  window.open(createWhatsAppLink(message), "_blank", "noopener,noreferrer");
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
