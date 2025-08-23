window.onload = function() {
  const couponBox = document.getElementById("daily-coupon-box");
  const stored = JSON.parse(localStorage.getItem("dailyCoupon") || "{}");
  couponBox.textContent = stored.code || "—";

  document.querySelectorAll('.size').forEach(sel => sel.addEventListener('change', updateTotal));
  document.querySelectorAll('.qty').forEach(qty => qty.addEventListener('input', updateTotal));
  document.getElementById("secondary-coupon").addEventListener("input", renderCart);

  function updateTotal() {
    const r = this.closest('tr');
    const sel = r.querySelector('.size');
    const qty = +r.querySelector('.qty').value;
    const price = sel ? +sel.value : +r.dataset.price;
    r.querySelector('.price').textContent = price + '₪';
    r.querySelector('.total-cell').textContent = (price * qty) + '₪';
  }

  function renderCart() {
    // سيتم استدعاء CartCore و DiscountEngine لاحقًا
  }
};
