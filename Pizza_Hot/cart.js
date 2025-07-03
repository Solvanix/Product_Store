// cart.js — سلة موحدة لجميع الصفحات
let userName = localStorage.getItem("userName") || "";
let userAddr = localStorage.getItem("userAddr") || "";
let key = "orders_" + (userName || "guest");
let cartData = JSON.parse(localStorage.getItem(key) || "[]");

function addToCart(item, price, qty = 1) {
  for (let i = 0; i < qty; i++) {
    cartData.push({ item, price });
  }
  localStorage.setItem(key, JSON.stringify(cartData));
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const waLink = document.getElementById("whatsapp-link");
  if (!list || !totalEl || !waLink) return;

  list.innerHTML = "";
  let total = 0;
  let msg = `مرحبًا ${userName || "ضيف"}%0A`;
  if (userAddr) msg += `📍 ${userAddr}%0A`;
  msg += "طلب:%0A";

  cartData.forEach(({ item, price }) => {
    const li = document.createElement("li");
    li.textContent = `${item} – ${price}₪`;
    list.appendChild(li);
    total += price;
    msg += `• ${item} – ${price}₪%0A`;
  });

  totalEl.textContent = total + "₪";
  msg += `------------------%0Aالإجمالي: ${total}₪`;
  waLink.href = "https://wa.me/972569788731?text=" + encodeURIComponent(msg);
}

document.addEventListener("DOMContentLoaded", renderCart);