// Friluftsäventyr – offers
// Each offer is an object. Price is per person, in kronor.
const offers = [
  {
    id: "kanot",
    name: "Kanottur",
    description: "Paddla i lugnt vatten i Stockholms skärgård. 3 timmar med guide.",
    price: 450
  },
  {
    id: "klattring",
    name: "Klättring",
    description: "Lär dig klättra på klippor med erfarna instruktörer. Utrustning ingår.",
    price: 550
  },
  {
    id: "mtb",
    name: "Mountainbiketur",
    description: "Cykla i skogsterräng utanför Stockholm. Cykel och hjälm ingår.",
    price: 400
  }
];

// Find the boxes on the page
const offersContainer = document.querySelector("#offers");
const offerSelect = document.querySelector("#offer");
const quantityInput = document.querySelector("#quantity");
const priceOutput = document.querySelector("#price");

// The form, the fields and their error messages
const form = document.querySelector("#booking-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const offerError = document.querySelector("#offer-error");
const quantityError = document.querySelector("#quantity-error");

// The buttons and the confirmation box
const submitButton = form.querySelector('button[type="submit"]');
const resetButton = document.querySelector("#reset-button"); // NEW
const confirmationBox = document.querySelector("#confirmation");

// Remembers which offer is chosen ("" = nothing chosen yet)
let selectedOfferId = "";

// Becomes true after the first click on "Bekräfta"
let hasTriedToSubmit = false;

// Becomes true when the booking request is confirmed
let isConfirmed = false;

// Show all offers: one card and one dropdown option per offer
function showOffers() {
  for (const offer of offers) {
    // The card is a button, so it can be clicked and reached with the keyboard
    const card = document.createElement("button");
    card.type = "button";
    card.className = "offer-card";
    card.dataset.id = offer.id;
    card.setAttribute("aria-pressed", "false");

    // Empty label that shows "✓ Vald" when this card is chosen
    const badge = document.createElement("span");
    badge.className = "offer-badge";

    const name = document.createElement("span");
    name.className = "offer-name";
    name.textContent = offer.name;

    const description = document.createElement("span");
    description.className = "offer-description";
    description.textContent = offer.description;

    const price = document.createElement("span");
    price.className = "offer-price";
    price.textContent = offer.price + " kr / person";

    card.append(badge, name, description, price);
    offersContainer.append(card);

    // Clicking the card selects this offer
    card.addEventListener("click", function () {
      selectOffer(offer.id);
    });

    // Same offer as an option in the dropdown list
    const option = document.createElement("option");
    option.value = offer.id;
    option.textContent = offer.name;
    offerSelect.append(option);
  }
}

// Select an offer by its id, and show it on the page
function selectOffer(id) {
  selectedOfferId = id;
  offerSelect.value = id;

  const cards = document.querySelectorAll(".offer-card");
  for (const card of cards) {
    const isSelected = card.dataset.id === id;

    card.classList.toggle("selected", isSelected);
    card.setAttribute("aria-pressed", isSelected);
    card.querySelector(".offer-badge").textContent = isSelected ? "✓ Vald" : "";
  }

  updatePrice();
  revalidateIfNeeded();
}

// Returns the chosen offer object, or undefined if none is chosen
function getSelectedOffer() {
  return offers.find(function (offer) {
    return offer.id === selectedOfferId;
  });
}

// Returns the quantity as a number if it is a whole number 1–5, otherwise null
function getQuantity() {
  const text = quantityInput.value.trim();
  const number = Number(text);

  if (text === "" || !Number.isInteger(number) || number < 1 || number > 5) {
    return null;
  }
  return number;
}

// The price calculation – price per unit × quantity
function calculateTotal(pricePerUnit, quantity) {
  return pricePerUnit * quantity;
}

// Shows the total, or a clear message when no price can be calculated
function updatePrice() {
  const offer = getSelectedOffer();
  const quantity = getQuantity();

  if (!offer) {
    priceOutput.textContent = "Välj ett erbjudande för att se priset.";
    return;
  }

  if (quantity === null) {
    priceOutput.textContent = "Ange ett antal mellan 1 och 5 för att se priset.";
    return;
  }

  const total = calculateTotal(offer.price, quantity);
  const unit = quantity === 1 ? "person" : "personer";
  priceOutput.textContent = total + " kr (" + offer.price + " kr × " + quantity + " " + unit + ")";
}

// ---------- VALIDATION ----------
// Each function returns an error message, or "" if the field is OK.

function getNameError() {
  if (nameInput.value.trim() === "") {
    return "Fyll i ditt namn. Det får inte bara innehålla mellanslag.";
  }
  return "";
}

function getEmailError() {
  const email = emailInput.value;

  if (email.trim() === "") {
    return "Fyll i din e-postadress.";
  }
  if (email.includes(" ")) {
    return "E-postadressen får inte innehålla mellanslag.";
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return "E-postadressen ska innehålla exakt ett @.";
  }

  const beforeAt = parts[0];
  const afterAt = parts[1];
  if (beforeAt === "" || afterAt === "") {
    return "Det måste finnas text både före och efter @.";
  }

  // The part after @ must have at least one dot, with text on both sides of every dot
  const domainParts = afterAt.split(".");
  if (domainParts.length < 2 || domainParts.includes("")) {
    return "Delen efter @ måste ha en punkt med text på båda sidor, t.ex. exempel.se.";
  }

  return "";
}

function getOfferError() {
  if (!getSelectedOffer()) {
    return "Välj ett äventyr, antingen genom att klicka på ett kort eller i listan.";
  }
  return "";
}

function getQuantityError() {
  if (getQuantity() === null) {
    return "Antal personer måste vara ett heltal mellan 1 och 5.";
  }
  return "";
}

// Writes a message under a field (or removes it when message is "")
function showError(field, errorElement, message) {
  errorElement.textContent = message;
  field.setAttribute("aria-invalid", message !== "");
}

// Checks all fields, shows all messages, returns true only if everything is valid
function validateForm() {
  const nameMessage = getNameError();
  const emailMessage = getEmailError();
  const offerMessage = getOfferError();
  const quantityMessage = getQuantityError();

  showError(nameInput, nameError, nameMessage);
  showError(emailInput, emailError, emailMessage);
  showError(offerSelect, offerError, offerMessage);
  showError(quantityInput, quantityError, quantityMessage);

  return nameMessage === "" && emailMessage === "" && offerMessage === "" && quantityMessage === "";
}

// After the first attempt, update the messages every time the user changes something
function revalidateIfNeeded() {
  if (hasTriedToSubmit) {
    validateForm();
  }
}

// ---------- CONFIRMATION ----------

// Locks (true) or unlocks (false) everything the user could change
function setFormLocked(locked) {
  nameInput.disabled = locked;
  emailInput.disabled = locked;
  offerSelect.disabled = locked;
  quantityInput.disabled = locked;
  submitButton.disabled = locked;

  const cards = document.querySelectorAll(".offer-card");
  for (const card of cards) {
    card.disabled = locked;
  }
}

// Adds one line like "Namn: Anna" to the summary list
function addSummaryLine(list, label, value) {
  const item = document.createElement("li");
  item.textContent = label + ": " + value;
  list.append(item);
}

// Shows the summary and locks the form
function showConfirmation() {
  // Save exactly what is being confirmed, at this moment
  const offer = getSelectedOffer();
  const quantity = getQuantity();
  const booking = {
    name: nameInput.value.trim(),
    email: emailInput.value,
    offerName: offer.name,
    quantity: quantity,
    unit: quantity === 1 ? "person" : "personer",
    total: calculateTotal(offer.price, quantity)
  };

  // Empty the box first, so there is never more than one confirmation
  confirmationBox.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = "✓ Tack! Din bokningsförfrågan är skickad";
  heading.tabIndex = -1; // lets us move keyboard focus here

  const list = document.createElement("ul");
  addSummaryLine(list, "Namn", booking.name);
  addSummaryLine(list, "E-post", booking.email);
  addSummaryLine(list, "Erbjudande", booking.offerName);
  addSummaryLine(list, "Antal", booking.quantity + " " + booking.unit);
  addSummaryLine(list, "Totalpris", booking.total + " kr");

  const info = document.createElement("p");
  info.textContent = "Vill du göra en ny förfrågan? Välj Börja om.";

  confirmationBox.append(heading, list, info);

  isConfirmed = true;
  setFormLocked(true);
  heading.focus(); // screen reader and keyboard users land on the confirmation
}

// ---------- NEW: RESET ("Börja om") ----------

function resetForm() {
  // 1. Back to the "filling in" state, with nothing locked
  isConfirmed = false;
  hasTriedToSubmit = false;
  setFormLocked(false);

  // 2. Empty name and email, quantity back to 1
  nameInput.value = "";
  emailInput.value = "";
  quantityInput.value = "1";

  // 3. Remove the chosen offer, the "✓ Vald" marking and reset the price message
  selectOffer("");

  // 4. Remove all error messages
  showError(nameInput, nameError, "");
  showError(emailInput, emailError, "");
  showError(offerSelect, offerError, "");
  showError(quantityInput, quantityError, "");

  // 5. Remove the confirmation
  confirmationBox.replaceChildren();

  // 6. Put the cursor in the first field, ready for a new request
  nameInput.focus();
}

// ---------- EVENTS ----------

// Choosing in the dropdown selects the same offer
offerSelect.addEventListener("change", function () {
  selectOffer(offerSelect.value);
});

// Changing the quantity updates the price right away
quantityInput.addEventListener("input", function () {
  updatePrice();
  revalidateIfNeeded();
});

// Typing in name or email updates their error messages
nameInput.addEventListener("input", revalidateIfNeeded);
emailInput.addEventListener("input", revalidateIfNeeded);

// Clicking "Bekräfta"
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  // A confirmed request cannot be confirmed again
  if (isConfirmed) {
    return;
  }

  hasTriedToSubmit = true;

  if (validateForm()) {
    showConfirmation();
  }
});

// NEW: clicking "Börja om" – works both while filling in and after confirming
resetButton.addEventListener("click", resetForm);

showOffers();