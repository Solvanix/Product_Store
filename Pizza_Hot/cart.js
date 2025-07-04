cart_v2 = '''
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

  let msg = `مرحبًا ${userName || "ضيف"}%0A`;
  if (userAddr) msg += `📍 ${userAddr}%0A`;
  msg += "طلبك:%0A";

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
    msg += `• ${item} – ${price}₪%0A`;
  });

  const userNote = noteInput ? noteInput.value.trim() : "";
  if (userNote) msg += `%0A📝 ملاحظات: ${userNote}%0A`;

  msg += `------------------%0A`;
  msg += `إجمالي العروض: ${promoTotal}₪%0A`;
  msg += `إجمالي العادي: ${regularTotal}₪%0A`;
  msg += `📦 الإجمالي الكلي: ${total}₪`;

  totalEl.textContent = total + "₪";
  waLink.href = "https://wa.me/972569788731?text=" + encodeURIComponent(msg);
}

window.onload = renderCart;
'''

path = "/home/ali/0_gh_repos/Product_Store/Pizza_Hot/cart.js"
with open(path, "w", encoding="utf-8") as f:
    f.write(cart_v2.strip())
    print("✅ تم تحديث cart.js لدعم الملاحظات والعروض.")
