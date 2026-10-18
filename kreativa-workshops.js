
const workshops = [
    {
        id: 1,
        name: "Keramik",
        description: "Dreja din egen kopp eller skål. Allt material ingår.",
        price: 500
    },
    {
        id: 2,
        name: "Måleri",
        description: "Måla med akvarell eller akryl med en konstnär som lärare.",
        price: 400
    },
    {
        id: 3,
        name: "Silversmide",
        description: "Gör ditt eget silversmycke att ta med hem.",
        price: 650
    }
];


const workshopList = document.getElementById("workshopList");

// ===================================
// VISA WORKSHOPKORT
// ===================================


for (let i = 0; i < workshops.length; i++) {
    workshopList.innerHTML += `
        <div class="workshop-card" onclick="selectWorkshop(${workshops[i].id})">
            <h3>${workshops[i].name}</h3>
            <p>${workshops[i].description}</p>
            <p>${workshops[i].price} kr per person</p>
        </div>
    `;
}


let selectedWorkshop = null;


function selectWorkshop(id) {
    selectedWorkshop = workshops[id - 1];

    // Uppdatera rullgardinsmenyn
    document.getElementById("workshopSelect").value = id;

    // Ta bort tidigare markeringar
    const cards = document.querySelectorAll(".workshop-card");

    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("selected");
    }

    // Markera den valda workshopen
    cards[id - 1].classList.add("selected");

    document.getElementById("selectedWorkshop").textContent =
        "Vald workshop: " + selectedWorkshop.name;

    calculatePrice();
}

// ===================================
// BERÄKNA TOTALPRIS
// ===================================

function calculatePrice() {
    const quantity = Number(document.getElementById("quantity").value);

    if (selectedWorkshop == null) {
        document.getElementById("priceMessage").innerHTML =
            "Välj ett erbjudande för att se priset.";
        return;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
        document.getElementById("priceMessage").innerHTML =
            "Du måste välja mellan 1 och 5 personer.";
        return;
    }

    const totalPrice = selectedWorkshop.price * quantity;

    
document.getElementById("priceMessage").innerHTML =
    totalPrice + " kr" +
    "<span class='price-details'>" +
    selectedWorkshop.price + " kr × " + quantity + " personer" +
    "</span>";

}

const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const atPosition = email.indexOf("@");
    const domain = email.substring(atPosition + 1);

    // Kontrollera namn
    if (name.trim() == "") {
        document.getElementById("nameError").innerHTML =
            "Du måste fylla i ditt namn.";
    } else {
        document.getElementById("nameError").innerHTML = "";
    }

    // Kontrollera e-post
    if (
    email.trim() == "" ||
    email.includes(" ") ||
    email.indexOf("@") == -1 ||
    email.indexOf("@") != email.lastIndexOf("@") ||
    atPosition == 0 ||
    atPosition == email.length - 1 ||
    domain.indexOf(".") <= 0 ||
    domain.indexOf(".") == domain.length - 1
) {
    document.getElementById("emailError").innerHTML =
        "Fyll i en giltig e-postadress.";
} else {
    document.getElementById("emailError").innerHTML = "";
}

    // Kontrollera workshop
    if (selectedWorkshop == null) {
        document.getElementById("workshopError").innerHTML =
            "Du måste välja en workshop.";
    } else {
        document.getElementById("workshopError").innerHTML = "";
    }


    // ===================================
    // BOKNINGSBEKRÄFTELSE
    // ===================================

    const quantity = Number(document.getElementById("quantity").value);

    if (
        name.trim() !== "" &&
        document.getElementById("emailError").innerHTML === "" &&
        selectedWorkshop !== null &&
        Number.isInteger(quantity) &&
        quantity >= 1 &&
        quantity <= 5
    ) {
        
                

                
        const totalPrice = selectedWorkshop.price * quantity;

        const confirmation = document.getElementById("bookingConfirmation");

        confirmation.replaceChildren();

        const heading = document.createElement("strong");
        heading.textContent = "✓ Tack! Din bokningsförfrågan är registrerad på sidan.";
        confirmation.appendChild(heading);

        const details = [
            "Namn: " + name.trim(),
            "E-post: " + email.trim(),
            "Workshop: " + selectedWorkshop.name,
            "Antal: " + quantity + " personer",
            "Totalpris: " + totalPrice + " kr"
        ];

        for (let i = 0; i < details.length; i++) {
            const paragraph = document.createElement("p");
            paragraph.textContent = details[i];
            confirmation.appendChild(paragraph);
        }


    } else {
        document.getElementById("bookingConfirmation").textContent = "";
    }

});

// ===================================
// ÅTERSTÄLL BOKNING
// ===================================

const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", function() {

    // Återställ vald workshop
    selectedWorkshop = null;

    
    // Återställ rullgardinsmenyn
    document.getElementById("workshopSelect").value = "";

    // Ta bort orange markering från workshopkorten
    const cards = document.querySelectorAll(".workshop-card");

    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("selected");
    }


    document.getElementById("selectedWorkshop").textContent =
        "Ingen workshop vald";

    // Återställ antal personer
    document.getElementById("quantity").value = 1;

    // Töm formuläret
    bookingForm.reset();

    // Återställ priset
    document.getElementById("priceMessage").textContent =
        "Välj en workshop för att se priset.";

    // Ta bort felmeddelanden
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("workshopError").textContent = "";

    // Ta bort bokningsbekräftelsen
    document.getElementById("bookingConfirmation").textContent = "";

});


// ===================================
// VÄLJ WORKSHOP VIA RULLGARDINSMENYN
// ===================================

const workshopSelect = document.getElementById("workshopSelect");

workshopSelect.addEventListener("change", function() {
    const id = Number(workshopSelect.value);

    if (id === 0) {
        selectedWorkshop = null;

        document.querySelectorAll(".workshop-card").forEach(function(card) {
            card.classList.remove("selected");
        });

        document.getElementById("selectedWorkshop").textContent =
            "Ingen workshop vald";

        calculatePrice();
    } else {
        selectWorkshop(id);
    }

    document.getElementById("bookingConfirmation").textContent = "";
});
