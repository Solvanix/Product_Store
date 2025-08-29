const MessageBuilder = (() => {
  function classify(itemName) {
    const name = itemName.toLowerCase();
    if (name.includes("بيتزا") || name.includes("كلزوني")) return "pizza";
    if (name.includes("بطاطا") || name.includes("زنجر") || name.includes("أجنحة")) return "sides";
    if (name.includes("كولا") || name.includes("عصير") || name.includes("مشروب")) return "drinks";
    return "other";
  }

  function mergeCart(cart) {
    const merged = {};
    cart.forEach(({ label, price, qty }) => {
      const key = label;
      if (!merged[key]) merged[key] = { label, price, qty: 0 };
      merged[key].qty += qty;
    });
    return Object.values(merged);
  }

  function build(cart, userName, userAddr, finalTotal, discounts, breakdown, rawTotal, orderId = null) {
    const id = orderId || Math.floor(100000 + Math.random() * 900000);
    let msg = `🍕 PIZZA HOT – طلب جديد\nرقم الطلب: #${id}\n------------------\n`;
    msg += `👤 ${userName || "ضيف"}\n`;
    if (userAddr) msg += `📍 ${userAddr}\n`;
    msg += `\n📦 تفاصيل الطلب:\n`;

    const sections = { pizza: [], sides: [], drinks: [], other: [] };
    const mergedCart = mergeCart(cart);

    mergedCart.forEach(({ label, price, qty }) => {
      const line = `• ${label} ×${qty} = ${price * qty}₪`;
      sections[classify(label)].push(line);
    });

    if (sections.pizza.length) msg += `\n🍕 بيتزا:\n` + sections.pizza.join("\n");
    if (sections.sides.length) msg += `\n\n🍟 جانبي:\n` + sections.sides.join("\n");
    if (sections.drinks.length) msg += `\n\n🥤 مشروبات:\n` + sections.drinks.join("\n");
    if (sections.other.length) msg += `\n\n📦 أخرى:\n` + sections.other.join("\n");

    msg += `\n\n------------------\n📦 قبل الخصم: ${rawTotal}₪`;
    msg += `\n📦 بعد الخصم: ${finalTotal}₪`;

    if (discounts?.length) {
      msg += `\n💸 خصومات مفعّلة: ${discounts.join(", ")}`;
    }

    if (breakdown?.length) {
      msg += `\n📊 تفاصيل الخصومات:\n` + breakdown.join("\n");
    }

    // 🔍 تنبيه المنتجات بسعر مجهول
    const unknowns = cart.filter(item => item.price === 0);
    if (unknowns.length) {
      msg += `\n⚠️ المنتجات التالية بدون سعر:\n`;
      unknowns.forEach(u => {
        msg += `• ${u.label} ×${u.qty}\n`;
      });
      msg += `\n🔒 الطلب في انتظار موافقة المشرف على الأسعار.`;
      msg += `\n📎 رابط المتابعة: https://pizza-hot.store/orders/pending/${id}`;
    }

    msg += `\n\n🙏 شكرًا لك ${userName || "ضيف"} على طلبك من PIZZA HOT!`;

    return msg;
  }

  return { build };
})();
