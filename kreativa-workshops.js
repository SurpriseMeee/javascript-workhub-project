const workshops = [
    {
        id: 1,
        name: "Keramik",
        description: "Skapa egna föremål i lera.",
        price: 350
    },
    {
        id: 2,
        name: "Måleri",
        description: "Måla en egen tavla med handledning.",
        price: 250
    },
    {
        id: 3,
        name: "Silversmide",
        description: "Skapa ett personligt smycke i silver.",
        price: 500
    }
];

const workshopList = document.getElementById("workshopList");

for (let i = 0; i < workshops.length; i++) {
    workshopList.innerHTML += "<h3>" + workshops[i].name + "</h3>";
    workshopList.innerHTML += "<p>" + workshops[i].description + "</p>";
    workshopList.innerHTML += "<p>" + workshops[i].price + " kr per person</p>";
    workshopList.innerHTML += "<button onclick='selectWorkshop(" + workshops[i].id + ")'>Välj</button>";
}

let selectedWorkshop = null;

function selectWorkshop(id) {
    selectedWorkshop = workshops[id - 1];

    console.log("Vald workshop: " + selectedWorkshop.name);

    document.getElementById("selectedWorkshop").innerHTML =
        "Vald workshop: " + selectedWorkshop.name;
    
    calculatePrice();
}

function calculatePrice() {
    const quantity = document.getElementById("quantity").value;

    if (selectedWorkshop == null) {
        document.getElementById("priceMessage").innerHTML =
            "Välj en workshop för att se priset.";
        return;
    }

    const totalPrice = selectedWorkshop.price * quantity;

    document.getElementById("priceMessage").innerHTML =
        "Totalpris: " + totalPrice + " kr";
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

});