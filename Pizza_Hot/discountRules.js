(function registerDiscountRules(){

  // ✅ خصومات تلقائية حسب الإجمالي
  DiscountEngine.addRule({
    name: "خصم فوق 100₪",
    priority: 80,
    source: "auto",
    conditionFn: (total) => total > 100,
    applyFn: (total) => total * 0.05
  });

  DiscountEngine.addRule({
    name: "خصم ضخم فوق 200₪",
    priority: 85,
    source: "auto",
    conditionFn: (total) => total > 200,
    applyFn: () => 20
  });

  // ✅ خصم الغداء
  DiscountEngine.addRule({
    name: "خصم الغداء",
    priority: 70,
    source: "auto",
    conditionFn: () => {
      const h = new Date().getHours();
      return h >= 14 && h <= 17;
    },
    applyFn: () => 10
  });

  // ✅ خصم الجمعة
  DiscountEngine.addRule({
    name: "خصم الجمعة",
    priority: 90,
    source: "auto",
    conditionFn: () => new Date().getDay() === 5,
    applyFn: total => total * 0.05
  });

  // ✅ خصم ولاء رمزي
  DiscountEngine.addRule({
    name: "خصم رمزي",
    priority: 60,
    source: "auto",
    conditionFn: (_, __, user) => user.toLowerCase().startsWith("ali"),
    applyFn: total => total * 0.05
  });

  // ✅ كوبونات مخصصة (يدوية)
  DiscountEngine.addRule({
    name: "رمز منشور اليوم FB10",
    priority: 100,
    source: "manual",
    code: "FB10",
    conditionFn: (_, __, ___, coupon1) => coupon1 === "FB10",
    applyFn: () => 10
  });

  DiscountEngine.addRule({
    name: "رمز HOT10 (نسخة احتياطية)",
    priority: 100,
    source: "manual",
    code: "HOT10",
    conditionFn: (_, __, ___, coupon1) => coupon1 === "HOT10",
    applyFn: () => 10
  });

  DiscountEngine.addRule({
    name: "رمز FBFAN20",
    priority: 100,
    source: "manual",
    code: "FBFAN20",
    conditionFn: (_, __, ___, coupon1) => coupon1 === "FBFAN20",
    applyFn: total => total * 0.2
  });

  // ✅ خصم كمية
  DiscountEngine.addRule({
    name: "خصم كمية",
    priority: 75,
    source: "auto",
    conditionFn: (_, cart) => cart.length >= 5,
    applyFn: total => total * 0.05
  });

  // ✅ كوبون ولاء شهري
  DiscountEngine.addRule({
    name: "كوبون ولاء شهري",
    priority: 95,
    source: "auto",
    conditionFn: () => {
      const totalSpent = parseInt(localStorage.getItem("monthlySpent") || "0");
      return totalSpent >= 500 && !localStorage.getItem("loyaltyCouponUsed");
    },
    applyFn: () => {
      localStorage.setItem("loyaltyCouponUsed", "true");
      return 30;
    }
  });

  // ✅ خصم يومي فريد
  DiscountEngine.addRule({
    name: "رمز يومي فريد",
    priority: 100,
    source: "manual",
    code: (() => {
      const stored = JSON.parse(localStorage.getItem("dailyCoupon") || "{}");
      return stored.code || "";
    })(),
    conditionFn: (_, __, ___, coupon1) => {
      const stored = JSON.parse(localStorage.getItem("dailyCoupon") || "{}");
      const used = localStorage.getItem("dailyCouponUsed") === "true";
      return coupon1 === stored.code && !used;
    },
    applyFn: total => {
      localStorage.setItem("dailyCouponUsed", "true");
      return total * 0.2;
    }
  });

})();
