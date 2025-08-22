// discountRules.js – قواعد الخصم الرمزية القابلة للتوسع
(function registerDiscountRules(){

  // ✅ خصومات حسب الإجمالي
  DiscountEngine.addRule("خصم فوق 100₪",
    (total) => total > 100,
    (total) => total * 0.9
  );

  DiscountEngine.addRule("خصم ضخم فوق 200₪",
    (total) => total > 200,
    (total) => total - 20
  );

  // ✅ خصم الغداء (بين 14:00 و17:00)
  DiscountEngine.addRule("خصم الغداء",
    () => {
      const h = new Date().getHours();
      return h >= 14 && h <= 17;
    },
    (total) => total - 10
  );

  // ✅ خصم الجمعة
  DiscountEngine.addRule("خصم الجمعة",
    () => new Date().getDay() === 5,
    (total) => total * 0.95
  );

  // ✅ خصم ولاء رمزي (يبدأ الاسم بـ "ali")
  DiscountEngine.addRule("خصم ولاء رمزي",
    (_, __, user) => user.toLowerCase().startsWith("ali"),
    (total) => total * 0.95
  );

  // ✅ كوبونات مخصصة
  DiscountEngine.addRule("خصم فيسبوك FB10",
    () => localStorage.getItem("userCoupon") === "FB10",
    (total) => total * 0.9
  );

  DiscountEngine.addRule("خصم HOT10 (نسخة احتياطية)",
    () => localStorage.getItem("userCoupon") === "HOT10",
    (total) => total * 0.9
  );

  DiscountEngine.addRule("خصم FBFAN20 (متابع فيسبوك)",
    () => localStorage.getItem("userCoupon") === "FBFAN20",
    (total) => total * 0.8
  );

  // ✅ خصم حسب عدد الأصناف
  DiscountEngine.addRule("خصم كمية",
    (_, cart) => cart.length >= 5,
    (total) => total * 0.95
  );

  // ✅ كوبون ولاء شهري لمرة واحدة
  DiscountEngine.addRule("كوبون ولاء تلقائي",
    () => {
      const totalSpent = parseInt(localStorage.getItem("monthlySpent") || "0");
      return totalSpent >= 500 && !localStorage.getItem("loyaltyCouponUsed");
    },
    (total) => {
      localStorage.setItem("loyaltyCouponUsed", "true");
      return total - 30;
    }
  );

  // ✅ خصم يومي فريد (كود يُولد تلقائيًا)
  DiscountEngine.addRule("خصم يومي فريد",
    () => {
      const input = localStorage.getItem("userCoupon");
      const stored = JSON.parse(localStorage.getItem("dailyCoupon") || "{}");
      const used = localStorage.getItem("dailyCouponUsed") === "true";
      return input === stored.code && !used;
    },
    total => {
      localStorage.setItem("dailyCouponUsed", "true");
      return total * 0.8;
    }
  );

})();
