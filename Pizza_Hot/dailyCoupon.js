// dailyCoupon.js – توليد كود خصم يومي فريد مرتبط بالجهاز
(function generateDailyCoupon(){
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const stored = JSON.parse(localStorage.getItem("dailyCoupon") || "{}");

  // إذا تم توليد الكود بالفعل اليوم، نعيده
  if (stored.date === today) {
    showCoupon(stored.code);
    return;
  }

  // توليد كود جديد
  const rand = Math.random().toString(36).slice(-6).toUpperCase();
  const code = `DAY-${today.replace(/-/g, "")}-${rand}`;

  // حفظ الكود في الجهاز
  localStorage.setItem("dailyCoupon", JSON.stringify({ date: today, code }));
  localStorage.removeItem("dailyCouponUsed"); // إعادة التفعيل

  showCoupon(code);
})();

// عرض الكود في الصفحة
function showCoupon(code){
  const box = document.getElementById("daily-coupon-box");
  if (box) box.textContent = code;
}
