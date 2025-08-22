// discountEngine.js – محرك الخصومات الرمزية المتدرجة
const DiscountEngine = (() => {
  let rules = [];

  function addRule({ name, priority = 50, source = "auto", code = null, conditionFn, applyFn }) {
    rules.push({ name, priority, source, code, conditionFn, applyFn });
  }

  function apply(rawTotal, cart, user, coupon1 = "", coupon2 = "") {
    let total = rawTotal;
    let applied = [];
    let breakdown = [];

    // استخراج الخصومات المؤهلة
    const eligible = rules.filter(rule =>
      rule.conditionFn(rawTotal, cart, user, coupon1, coupon2)
    );

    // ترتيب حسب الأولوية
    const sorted = eligible.sort((a, b) => b.priority - a.priority);

    sorted.forEach(rule => {
      let factor = 1;

      // إذا كان الكود الثانوي
      if (rule.source === "manual" && rule.code && rule.code === coupon2) {
        factor = 0.25;
      }

      const discountValue = Math.floor(rule.applyFn(rawTotal) * factor);
      total -= discountValue;
      applied.push(rule.name);
      breakdown.push(`• ${rule.name}: ${discountValue}₪ (${Math.round(factor * 100)}٪ من قيمته)`);
    });

    return {
      total: Math.max(total, 0),
      applied,
      breakdown
    };
  }

  return {
    addRule,
    apply
  };
})();
