// 🔐 DiscountEngine – PIZZA HOT
// 📦 القواعد تُحمّل حصريًا من rules.json عبر loadRulesFrom()
// ❌ لا تُضاف قواعد يدويًا خارج هذا المصدر

function countItems(cart, sizes = []) {
  return cart.reduce((sum, item) => {
    const matchedSize = sizes.some(size => item.item.includes(`(${size}`));
    return matchedSize ? sum + item.qty : sum;
  }, 0);
}

function isTomorrow(orderDate) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const d1 = new Date(orderDate);
  return d1.toDateString() === tomorrow.toDateString();
}

function isFutureDate(dateStr) {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr.slice(0, 10) > today;
}

function isLoyalCustomer(userName) {
  const firstOrderDate = localStorage.getItem(`${userName}_firstOrderDate`);
  const totalSpent = parseFloat(localStorage.getItem(`${userName}_totalSpent`) || "0");
  if (!firstOrderDate) return false;
  const daysSince = (new Date() - new Date(firstOrderDate)) / (1000 * 60 * 60 * 24);
  return daysSince >= 30 && totalSpent >= 150;
}

const DiscountEngine = (() => {
  let rules = [];

  function addRule(rule) {
    rules.push(rule);
  }

  function loadRulesFrom(rulesArray) {
    rulesArray.forEach(rule => {
      if (!rule.active) return;

      try {
        const conditionFn = function(total, cart, user, coupon1, coupon2, channel, orderDate, bookedVia, desiredHour) {
          const hour = new Date().getHours();
          return eval(rule.condition);
        };

        const applyFn = rule.value === "dynamic"
          ? new Function("total", "cart", "user", "coupon1", "coupon2", "channel", "orderDate", "bookedVia", "desiredHour", `return ${rule.applyFn};`)
          : new Function("total", "cart", "user", "coupon1", "coupon2", "channel", "orderDate", "bookedVia", "desiredHour",
              `return ${rule.type === "percentage" ? `total * ${rule.value}` : `${rule.value}`};`
            );

        addRule({
          name: rule.name,
          priority: rule.priority || 50,
          source: rule.source || "auto",
          code: rule.code || null,
          type: rule.type || "percentage",
          value: rule.value,
          conditionFn,
          applyFn
        });
      } catch (err) {
        console.warn(`⚠️ فشل تحميل القاعدة: ${rule.name}`, err);
      }
    });
  }

  function apply(total, cart, user, coupon1 = "", coupon2 = "", channel = "", orderDate = "", bookedVia = "", desiredHour = null) {
    let finalTotal = total;
    let applied = [];
    let breakdown = [];

    const sorted = rules
      .filter(r => typeof r.conditionFn === "function")
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    let primaryApplied = false;
    let secondaryApplied = false;

    if (coupon1 && coupon2 && coupon1.toLowerCase() === coupon2.toLowerCase()) {
      breakdown.push("❌ لا يمكن استخدام نفس الكود في الحقلين");
      coupon2 = "";
    }

    sorted.forEach(rule => {
      try {
        const ok = rule.conditionFn(finalTotal, cart, user, coupon1, coupon2, channel, orderDate, bookedVia, desiredHour);
        if (!ok) return;

        const isCouponRule = !!rule.code;
        const codeLower = rule.code?.toLowerCase() || "";
        const coupon1Lower = coupon1.toLowerCase();
        const coupon2Lower = coupon2.toLowerCase();

        const isPrimary = isCouponRule && codeLower === coupon1Lower;
        const isSecondary = isCouponRule && codeLower === coupon2Lower && codeLower !== coupon1Lower;

        if (isPrimary && !primaryApplied) {
          const value = rule.applyFn(finalTotal, cart, user, coupon1, coupon2, channel, orderDate, bookedVia, desiredHour);
          finalTotal -= value;
          applied.push(rule.name + " (كامل القيمة)");
          breakdown.push(`• ${rule.name} [${rule.source}]: -${Math.round(value)}₪`);
          primaryApplied = true;
          return;
        }

        if (isSecondary && !secondaryApplied) {
          const fullValue = rule.applyFn(finalTotal, cart, user, coupon1, coupon2, channel, orderDate, bookedVia, desiredHour);
          const partial = fullValue * 0.25;
          finalTotal -= partial;
          applied.push(rule.name + " (ربع القيمة)");
          breakdown.push(`• ${rule.name} [${rule.source}]: -${Math.round(partial)}₪`);
          secondaryApplied = true;
          return;
        }

        if (!isCouponRule && !primaryApplied) {
          const value = rule.applyFn(finalTotal, cart, user, coupon1, coupon2, channel, orderDate, bookedVia, desiredHour);
          finalTotal -= value;
          applied.push(rule.name);
          breakdown.push(`• ${rule.name} [${rule.source}]: -${Math.round(value)}₪`);
          primaryApplied = true;
        }

      } catch (err) {
        console.warn(`⚠️ فشل تطبيق القاعدة: ${rule.name}`, err);
      }
    });

    return {
      total: Math.round(finalTotal),
      applied,
      breakdown
    };
  }

  return {
    addRule,
    loadRulesFrom,
    apply
  };
})();
