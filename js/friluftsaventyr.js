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

// Test: show the array in the browser console
console.log(offers);
console.log("First offer:", offers[0].name);
console.log("Number of offers:", offers.length);