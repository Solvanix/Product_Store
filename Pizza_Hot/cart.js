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
  const noteInput = document.getElementById("cart-note");
  if (!list || !totalEl || !waLink) return;

  list.innerHTML = "";
  let total = 0;
  let promoTotal = 0;
  let regularTotal = 0;

  let msg = `🍕 Pizza Hot – طلب جديد\n------------------\n`;
  msg += `👤 ${userName || "ضيف"}\n`;
  if (userAddr) msg += `📍 ${userAddr}\n`;
  msg += `\n📦 الطلب:\n`;

  cartData.forEach(({ item, price }) => {
    const li = document.createElement("li");
    li.textContent = `${item} – ${price}₪`;
    list.appendChild(li);
    total += price;

    if (item.includes("عرض")) {
      promoTotal += price;
    } else {
      regularTotal += price;
    }

    msg += `• ${item} – ${price}₪\n`;
  });

  const userNote = noteInput ? noteInput.value.trim() : "";
  if (userNote) {
    msg += `\n📝 ملاحظات: ${userNote}\n`;
  }

  msg += `\n------------------\n`;
  if (promoTotal > 0) msg += `🎯 إجمالي العروض: ${promoTotal}₪\n`;
  if (regularTotal > 0) msg += `🧾 إجمالي العادي: ${regularTotal}₪\n`;
  msg += `📦 الإجمالي الكلي: ${total}₪`;

  totalEl.textContent = total + "₪";
  waLink.href = "https://wa.me/972569788731?text=" + encodeURIComponent(msg);
}

window.onload = renderCart;
