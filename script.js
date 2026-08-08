const WHATSAPP_NUMBER = "27721234567";

const products = {
  small: { name: "10 cm radius cookie", unit: "cookie", price: 10, cookiesPerUnit: 1, priceText: "R10 each" },
  large: { name: "12 cm radius cookies", unit: "pack", price: 60, cookiesPerUnit: 5, priceText: "Pack of 5 · R60" }
};

const form = document.getElementById("orderForm");
const quantityInput = document.getElementById("quantity");
const addressGroup = document.getElementById("addressGroup");

function selectedProduct() { return products[document.querySelector('input[name="product"]:checked').value]; }
function formatRand(amount) { return `R${amount}`; }

function updateOrder() {
  const product = selectedProduct();
  const quantity = Math.max(1, Number(quantityInput.value) || 1);
  quantityInput.value = quantity;
  const totalCookies = quantity * product.cookiesPerUnit;
  const total = quantity * product.price;
  const isPack = product.unit === "pack";
  document.getElementById("quantityLabel").textContent = isPack ? "Number of packs" : "Number of cookies";
  document.getElementById("priceLabel").textContent = product.name;
  document.getElementById("unitPrice").textContent = product.priceText;
  document.getElementById("countLabel").textContent = isPack ? "Cookies in your packs" : "Cookies";
  document.getElementById("cookieCount").textContent = totalCookies;
  document.getElementById("subTotal").textContent = formatRand(total);
  document.getElementById("grandTotal").textContent = formatRand(total);
  const deliveryChoice = document.querySelector('input[value="Delivery"]').parentElement;
  deliveryChoice.hidden = totalCookies < 50;
  if (totalCookies < 50) {
    document.querySelector('input[value="Collection"]').checked = true;
    addressGroup.hidden = true;
  }
}

document.getElementById("plusBtn").addEventListener("click", () => { quantityInput.value = Number(quantityInput.value || 1) + 1; updateOrder(); });
document.getElementById("minusBtn").addEventListener("click", () => { quantityInput.value = Math.max(1, Number(quantityInput.value || 1) - 1); updateOrder(); });
quantityInput.addEventListener("input", updateOrder);
document.querySelectorAll('input[name="product"]').forEach(input => input.addEventListener("change", () => { document.querySelectorAll(".choice").forEach(choice => choice.classList.toggle("active", choice.querySelector("input").checked)); updateOrder(); }));
document.querySelectorAll('input[name="delivery"]').forEach(input => input.addEventListener("change", () => { addressGroup.hidden = document.querySelector('input[name="delivery"]:checked').value !== "Delivery"; }));

form.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("customerName").value.trim();
  if (!name) { document.getElementById("customerName").focus(); return; }
  const product = selectedProduct();
  const quantity = Math.max(1, Number(quantityInput.value) || 1);
  const totalCookies = quantity * product.cookiesPerUnit;
  const total = quantity * product.price;
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("address").value.trim();
  const notes = document.getElementById("notes").value.trim();
  let message = `Hello Cheri's Home Bakes!\n\nI'd like to place an order.\n\nName: ${name}\nCell Number: ${phone || "Not provided"}\n\nOrder: ${quantity} ${product.unit}${quantity > 1 ? "s" : ""} of ${product.name}\nCookies: ${totalCookies}\nPrice: ${product.priceText}\nTotal: ${formatRand(total)}\n\nCollection / Delivery: ${delivery}`;
  if (delivery === "Delivery") message += `\nDelivery Address: ${address || "Not provided"}`;
  if (notes) message += `\nNotes: ${notes}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
});

updateOrder();
