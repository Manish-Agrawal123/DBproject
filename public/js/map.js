// map.js
const [lng, lat] = listingGeo.coordinates;

const map = L.map("map").setView([lat, lng], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const marker = L.marker([lat, lng]).addTo(map);

marker.bindPopup("<b>Exact location provided after Booking</b>");

marker.on("mouseover", function () {
  this.openPopup();
});

marker.on("mouseout", function () {
  this.closePopup();
});