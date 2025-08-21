let userName = localStorage.getItem("userName") || "";
let userAddr = localStorage.getItem("userAddr") || "";
let key = "orders_" + (userName || "guest");
let cartData = JSON.parse(localStorage.getItem(key) || "[]");

function addToCart(item, price, qty = 1) {
  for (let i = 0; i < qty; i++) {
    cartData.push({ item, price, note: "" }); // إضافة حقل الملاحظة
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
  let promoTotal = 0;
  let regularTotal = 0;

  let msg = `🍕 Pizza Hot – طلب جديد\n------------------\n`;
  msg += `👤 ${userName || "ضيف"}\n`;
  if (userAddr) msg += `📍 ${userAddr}\n`;
  msg += `\n📦 الطلب:\n`;

  cartData.forEach(({ item, price, note }, index) => {
    const li = document.createElement("li");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${item} – ${price}₪`;

    const noteInput = document.createElement("input");
    noteInput.type = "text";
    noteInput.placeholder = "ملاحظات؟";
    noteInput.value = note || "";
    noteInput.oninput = (e) => {
      cartData[index].note = e.target.value;
      localStorage.setItem(key, JSON.stringify(cartData));
    };

    li.appendChild(nameSpan);
    li.appendChild(noteInput);
    list.appendChild(li);

    total += price;
    if (item.includes("عرض")) {
      promoTotal += price;
    } else {
      regularTotal += price;
    }

    msg += `• ${item} – ${price}₪`;
    if (note) msg += ` [ملاحظة: ${note}]`;
    msg += `\n`;
  });

  msg += `\n------------------\n`;
  if (promoTotal > 0) msg += `🎯 إجمالي العروض: ${promoTotal}₪\n`;
  if (regularTotal > 0) msg += `🧾 إجمالي العادي: ${regularTotal}₪\n`;
  msg += `📦 الإجمالي الكلي: ${total}₪`;

  totalEl.textContent = total + "₪";
  waLink.href = "https://wa.me/972569788731?text=" + encodeURIComponent(msg);
}

window.onload = renderCart;
