const DiscountEngine = (() => {
  let rules = [];

  function addRule(rule) {
    rules.push(rule);
  }

  function loadRulesFrom(rulesArray) {
    rulesArray.forEach(rule => {
      if (!rule.active) return;

      try {
        const conditionFn = new Function(
          "total", "cart", "user", "coupon1", "coupon2", "channel", "orderDate", "bookedVia", "desiredHour",
          `return ${rule.condition};`
        );

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

    // ❌ منع استخدام نفس الكود في الحقلين
    if (coupon1 && coupon2 && coupon1.toLowerCase() === coupon2.toLowerCase()) {
      breakdown.push("❌ لا يمكن استخدام نفس الكود في الحقلين");
      coupon2 = ""; // تجاهل الكود الثانوي
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

        // كوبون أساسي
        if (isPrimary && !primaryApplied) {
          const value = rule.applyFn(finalTotal, cart, user, coupon1, coupon2, channel, orderDate, bookedVia, desiredHour);
          finalTotal -= value;
          applied.push(rule.name + " (كامل القيمة)");
          breakdown.push(`• ${rule.name}: -${Math.round(value)}₪`);
          primaryApplied = true;
          return;
        }

        // كوبون ثانوي ← ربع القيمة
        if (isSecondary && !secondaryApplied) {
          const fullValue = rule.applyFn(finalTotal, cart, user, coupon1, coupon2, channel, orderDate, bookedVia, desiredHour);
          const partial = fullValue * 0.25;
          finalTotal -= partial;
          applied.push(rule.name + " (ربع القيمة)");
          breakdown.push(`• ${rule.name}: -${Math.round(partial)}₪`);
          secondaryApplied = true;
          return;
        }

        // قاعدة تلقائية بدون كود
        if (!isCouponRule && !primaryApplied) {
          const value = rule.applyFn(finalTotal, cart, user, coupon1, coupon2, channel, orderDate, bookedVia, desiredHour);
          finalTotal -= value;
          applied.push(rule.name);
          breakdown.push(`• ${rule.name}: -${Math.round(value)}₪`);
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
