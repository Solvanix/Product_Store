// messageBuilder.js – توليد رسالة الطلب بشكل منسق
const MessageBuilder = (() => {
  function classify(itemName){
    const name = itemName.toLowerCase();
    if (name.includes("بيتزا") || name.includes("كلزوني")) return "pizza";
    if (name.includes("بطاطا") || name.includes("زنجر")) return "sides";
    if (name.includes("كولا") || name.includes("عصير")) return "drinks";
    return "other";
  }

  function build(cart, userName, userAddr, total, discounts){
    let msg = `🍕 Pizza Hot – طلب جديد\n------------------\n`;
    msg += `👤 ${userName || "ضيف"}\n`;
    if (userAddr) msg += `📍 ${userAddr}\n`;
    msg += `\n📦 الطلب:\n`;

    const sections = { pizza: [], sides: [], drinks: [], other: [] };

    cart.forEach(({ item, price, qty, note }) => {
      const line = `${item} ×${qty} – ${price * qty}₪` + (note ? ` [ملاحظة: ${note}]` : "");
      sections[classify(item)].push(line);
    });

    if (sections.pizza.length) msg += `\n🍕 بيتزا:\n` + sections.pizza.join("\n");
    if (sections.sides.length) msg += `\n\n🍟 جانبي:\n` + sections.sides.join("\n");
    if (sections.drinks.length) msg += `\n\n🥤 مشروبات:\n` + sections.drinks.join("\n");
    if (sections.other.length) msg += `\n\n📦 أخرى:\n` + sections.other.join("\n");

    msg += `\n\n------------------\n📦 الإجمالي الكلي: ${total}₪`;

    if (discounts && discounts.length) {
      msg += `\n💸 خصومات مفعّلة: ${discounts.join(", ")}`;
    }

    msg += `\n------------------\n📤 شكراً لاختياركم PIZZA HOT`;

    return msg;
  }

  return { build };
})();
