window.onload = () => {
  // تحميل القواعد من rules.json
  fetch("rules.json")
    .then(res => res.json())
    .then(data => DiscountEngine.loadRulesFrom(data));

  // تفعيل الأحداث العامة
  document.getElementById("start-btn").onclick = renderCart;
  document.getElementById("send-wa").onclick = sendOrder;
  document.getElementById("clear-cart").onclick = () => {
    localStorage.removeItem("cart");
    renderCart();
  };

  // تفعيل أزرار الإضافة حسب بنية الصفحة
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest("tr");
      const item = row.dataset.item;
      const qty = parseInt(row.querySelector(".qty").value || "1");

      const sizeSelect = row.querySelector(".size");
      const price = sizeSelect
        ? parseFloat(sizeSelect.value)
        : parseFloat(row.dataset.price || row.querySelector(".price")?.textContent);

      const sizeLabel = sizeSelect ? sizeSelect.selectedOptions[0].text : "";
      const itemLabel = sizeSelect ? `${item} (${sizeLabel})` : item;

      addToCart(itemLabel, price, qty);
      renderCart();
    };
  });

  // تفعيل تحديث السعر والإجمالي داخل الكتالوج
  document.querySelectorAll("tr[data-item]").forEach(row => {
    const sizeSelect = row.querySelector(".size");
    const qtyInput = row.querySelector(".qty");
    const priceCell = row.querySelector(".price");
    const totalCell = row.querySelector(".total-cell");

    function updateRowTotal() {
      const price = sizeSelect ? parseFloat(sizeSelect.value) : parseFloat(row.dataset.price);
      const qty = parseInt(qtyInput.value || "1");
      priceCell.textContent = `${price}₪`;
      totalCell.textContent = `${(price * qty).toFixed(2)}₪`;
    }

    if (sizeSelect) sizeSelect.onchange = updateRowTotal;
    if (qtyInput) qtyInput.oninput = updateRowTotal;

    updateRowTotal(); // تحديث أولي عند التحميل
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
    <p>الإجمالي قبل الخصم: ${rawTotal.toFixed(2)}₪</p>
    <p>الخصومات المطبقة:</p>
    <ul>${breakdown.map(b => `<li>${b}</li>`).join("")}</ul>
    <p>💸 الإجمالي بعد الخصم: <strong>${total.toFixed(2)}₪</strong></p>
    <p>📋 الكود الأساسي: ${coupon1 || "—"} | الكود الثانوي: ${coupon2 || "—"}</p>
    <p>🧾 محتوى السلة:</p>
    <ul>${cartData.map(i => `<li>${i.qty} × ${i.item} = ${(i.price * i.qty).toFixed(2)}₪</li>`).join("")}</ul>
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
${cartData.map(item => `• ${item.qty} × ${item.item} = ${(item.price * item.qty).toFixed(2)}₪`).join("\n")}
-----------------------
الإجمالي قبل الخصم: ${rawTotal.toFixed(2)}₪
الخصومات:
${breakdown.map(b => `- ${b}`).join("\n")}
الإجمالي بعد الخصم: ${total.toFixed(2)}₪
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
