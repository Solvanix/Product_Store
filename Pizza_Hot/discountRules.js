// discountRules.js – قواعد الخصم القابلة للتعديل
(function registerDiscountRules(){

  // ✅ خصم على الإجمالي الكبير
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

  // ✅ خصم ولاء رمزي (مثال: يبدأ الاسم بـ "ali")
  DiscountEngine.addRule("خصم ولاء",
    (_, __, user) => user.toLowerCase().startsWith("ali"),
    (total) => total * 0.95
  );

  // ✅ كوبون خصم من فيسبوك
  DiscountEngine.addRule("خصم فيسبوك",
    () => localStorage.getItem("userCoupon") === "FB10",
    (total) => total * 0.9
  );

  // ✅ خصم شهري لمرة واحدة عند تجاوز 500₪
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

})();
