window.onload = () => {
  // تحميل القواعد من rules.json
  fetch("rules.json")
    .then(res => res.json())
    .then(data => DiscountEngine.loadRulesFrom(data));

  // تفعيل الأحداث
  document.getElementById("start-btn").onclick = renderCart;
  document.getElementById("send-wa").onclick = sendOrder;
  document.getElementById("clear-cart").onclick = () => {
    localStorage.removeItem("cart");
    renderCart();
  };

  // تفعيل أزرار الإضافة
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.onclick = () => {
      const item = btn.dataset.item;
      const price = parseFloat(btn.dataset.price);
      const size = document.querySelector(`#size-${item}`)?.value || "";
      const qty = parseInt(document.querySelector(`#qty-${item}`)?.value || "1");
      addToCart(`${item} (${size})`, price, qty);
      renderCart();
    };
  });

  renderCart();
};

function addToCart(item, price, qty) {
  const cart = getCartData();
  const existing = cart.find(i => i.item === item);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ item, price, qty });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartData = getCartData();
  const userName = document.getElementById("user-name").value.trim();
  const coupon1 = document.getElementById("user-coupon").value.trim();
  const coupon2 = document.getElementById("secondary-coupon").value.trim();

  const channel = "instore";
  const orderDate = new Date().toISOString();
  const bookedVia = "whatsapp";
  const desiredHour = new Date().getHours();

  const rawTotal = cartData.reduce((sum, item) => sum + item.price * item.qty, 0);

  const { total, applied, breakdown } = DiscountEngine.apply(
    rawTotal, cartData, userName, coupon1, coupon2, channel, orderDate, bookedVia, desiredHour
  );

  const preview = document.getElementById("cart-preview");
  preview.innerHTML = `
    <h3>📦 معاينة الطلب</h3>
    <p>الاسم: ${userName || "—"}</p>
    <p>الإجمالي قبل الخصم: ${rawTotal}₪</p>
    <p>الخصومات المطبقة:</p>
    <ul>${breakdown.map(b => `<li>${b}</li>`).join("")}</ul>
    <p>💸 الإجمالي بعد الخصم: <strong>${total}₪</strong></p>
    <p>📋 الكود الأساسي: ${coupon1 || "—"} | الكود الثانوي: ${coupon2 || "—"}</p>
    <p>🧾 محتوى السلة:</p>
    <ul>${cartData.map(i => `<li>${i.qty} × ${i.item} = ${i.price * i.qty}₪</li>`).join("")}</ul>
  `;
}

function sendOrder() {
  const cartData = getCartData();
  const userName = document.getElementById("user-name").value.trim();
  const coupon1 = document.getElementById("user-coupon").value.trim();
  const coupon2 = document.getElementById("secondary-coupon").value.trim();

  const channel = "instore";
  const orderDate = new Date().toISOString();
  const bookedVia = "whatsapp";
  const desiredHour = new Date().getHours();

  const rawTotal = cartData.reduce((sum, item) => sum + item.price * item.qty, 0);

  const { total, applied, breakdown } = DiscountEngine.apply(
    rawTotal, cartData, userName, coupon1, coupon2, channel, orderDate, bookedVia, desiredHour
  );

  const message = `
طلب جديد من ${userName}:
-----------------------
${cartData.map(item => `• ${item.qty} × ${item.item} = ${item.price * item.qty}₪`).join("\n")}
-----------------------
الإجمالي قبل الخصم: ${rawTotal}₪
الخصومات:
${breakdown.map(b => `- ${b}`).join("\n")}
الإجمالي بعد الخصم: ${total}₪
الكود الأساسي: ${coupon1 || "—"}
الكود الثانوي: ${coupon2 || "—"}
  `;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encoded}`, "_blank");
}

function getCartData() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}
