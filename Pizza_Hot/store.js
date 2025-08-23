window.onload = () => {
  initCouponDisplay();
  initAutoDiscount();
  restoreUserData();
  enableEnterToSend();
  enableCopyOnClick();
  bindQuantityAndSizeEvents();
  bindCartEvents();
  enableCouponValidation();
};

// 🎟️ عرض الكود اليومي
function initCouponDisplay() {
  const couponBox = document.getElementById("daily-coupon-box");
  const stored = JSON.parse(localStorage.getItem("dailyCoupon") || "{}");
  couponBox.textContent = stored.code || "—";
}

// 🎁 تفعيل الخصم التلقائي
function initAutoDiscount() {
  const isFriday = new Date().getDay() === 5;
  const isHoliday = localStorage.getItem("isHoliday") === "true";
  if (isFriday || isHoliday) {
    const mainInput = document.getElementById("user-coupon");
    mainInput.disabled = true;
    mainInput.placeholder = "🎁 خصم تلقائي مفعّل";
    mainInput.style.background = "#eee";
    mainInput.style.cursor = "not-allowed";
    document.getElementById("auto-discount-alert").style.display = "block";
  }
}

// 👤 استرجاع بيانات المستخدم
function restoreUserData() {
  const name = localStorage.getItem("userName");
  const addr = localStorage.getItem("userAddress");
  if (name) document.getElementById("user-name").value = name;
  if (addr) document.getElementById("user-address").value = addr;
}

// ⌨️ تفعيل زر Enter لإرسال الطلب
function enableEnterToSend() {
  document.getElementById("user-address").addEventListener("keypress", e => {
    if (e.key === "Enter") sendOrder();
  });
}

// 📋 نسخ الطلب عند الضغط
function enableCopyOnClick() {
  document.getElementById("cart-preview").addEventListener("click", () => {
    const msg = document.getElementById("cart-preview").textContent;
    navigator.clipboard.writeText(msg).then(() => {
      alert("📋 تم نسخ الطلب إلى الحافظة");
    });
  });
}

// 🧮 تحديث السعر والإجمالي
function bindQuantityAndSizeEvents() {
  document.querySelectorAll(".size").forEach(sel => sel.addEventListener("change", updateRow));
  document.querySelectorAll(".qty").forEach(qty => qty.addEventListener("input", updateRow));
}

function updateRow() {
  const row = this.closest("tr");
  const sel = row.querySelector(".size");
  const qty = +row.querySelector(".qty").value;
  const price = sel ? +sel.value : +row.dataset.price;
  row.querySelector(".price").textContent = price + "₪";
  row.querySelector(".total-cell").textContent = (price * qty) + "₪";
}

// 🛒 ربط أزرار السلة
function bindCartEvents() {
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const qty = +row.querySelector(".qty").value;
      const sel = row.querySelector(".size");
      const price = sel ? +sel.value : +row.dataset.price;
      const item = sel ? `${row.dataset.item} (${sel.selectedOptions[0].text})` : row.dataset.item;
      CartCore.add(item, price, qty);
      CartCore.save();
      renderCart();
    });
  });

  document.getElementById("start-btn").onclick = renderCart;
  document.getElementById("clear-cart").onclick = () => {
    CartCore.clear();
    renderCart();
  };

  document.getElementById("send-wa").onclick = sendOrder;
  document.getElementById("secondary-coupon").addEventListener("input", renderCart);
}

// 🧾 معاينة الطلب
function renderCart() {
  const cartData = CartCore.getCurrentCart();
  const rawTotal = CartCore.total();
  const isAuto = new Date().getDay() === 5 || localStorage.getItem("isHoliday") === "true";
  const coupon1 = isAuto ? "" : document.getElementById("user-coupon").value.trim();
  const coupon2 = document.getElementById("secondary-coupon").value.trim();
  const { total, applied, breakdown } = DiscountEngine.apply(rawTotal, cartData, "معاينة", coupon1, coupon2);

  let msg = cartData.map(i => `• ${i.item} × ${i.qty} = ${i.price * i.qty}₪`).join("\n");
  msg += `\n📦 قبل الخصم: ${rawTotal}₪`;
  msg += `\n📦 بعد الخصم: ${total}₪`;
  if (applied.length) {
    msg += `\n💸 خصومات مفعّلة: ${applied.join(", ")}`;
    msg += `\n📊 تفاصيل:\n${breakdown.join("\n")}`;
  }
  document.getElementById("cart-preview").textContent = msg;
  updateCartCount();
}

// 📤 إرسال الطلب
function sendOrder() {
  const cartData = CartCore.getCurrentCart();
  if (cartData.length === 0) {
    alert("⚠️ لا يمكن إرسال طلب فارغ.");
    return;
  }

  const rawTotal = CartCore.total();
  const userName = document.getElementById("user-name").value.trim() || "ضيف";
  const userAddr = document.getElementById("user-address").value.trim();
  const isAuto = new Date().getDay() === 5 || localStorage.getItem("isHoliday") === "true";
  const coupon1 = isAuto ? "" : document.getElementById("user-coupon").value.trim();
  const coupon2 = document.getElementById("secondary-coupon").value.trim();

  localStorage.setItem("userCoupon", coupon1);
  localStorage.setItem("userName", userName);
  localStorage.setItem("userAddress", userAddr);

  const { total, applied, breakdown } = DiscountEngine.apply(rawTotal, cartData, userName, coupon1, coupon2);
  const msg = MessageBuilder.build(cartData, userName, userAddr, total, applied, breakdown, rawTotal);
  document.getElementById("cart-preview").textContent = msg;
  window.open("https://wa.me/972569788731?text=" + encodeURIComponent(msg), "_blank");
}

// 🔢 عرض عدد العناصر في زر الإرسال
function updateCartCount() {
  const count = CartCore.getCurrentCart().length;
  document.getElementById("send-wa").textContent = `📤 إرسال الطلب (${count})`;
}

// ⚠️ تنبيه عند إدخال كود غير معروف
function enableCouponValidation() {
  document.getElementById("user-coupon").addEventListener("blur", () => {
    const code = document.getElementById("user-coupon").value.trim();
    if (code && !(code in DiscountRules)) {
      alert("⚠️ الكود غير معروف أو غير صالح");
    }
  });
}
