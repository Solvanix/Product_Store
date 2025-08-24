window.onload = () => {
  // تحميل القواعد من rules.json
  fetch("rules.json")
    .then(res => res.json())
    .then(data => {
      DiscountEngine.loadRulesFrom(data);
      renderAutoCoupons(data); // ✅ عرض الرموز التلقائية مع التمييز الزمني
    });

  // تفعيل الأحداث العامة
  document.getElementById("start-btn").onclick = renderCart;
  document.getElementById("send-wa").onclick = sendOrder;
  document.getElementById("clear-cart").onclick = () => {
    localStorage.removeItem("cart");
    renderCart();
  };

  // زر نسخ الطلب إلى الحافظة (إن وجد)
  const copyBtn = document.getElementById("copy-order");
  if (copyBtn) copyBtn.onclick = copyOrderMessage;

  // تفعيل أزرار الإضافة حسب بنية الصفحة
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest("tr");
      const item = row.dataset.item;
      const qty = parseInt(row.querySelector(".qty").value || "1");

      const sizeSelect = row.querySelector(".size");
      const price = sizeSelect
        ? parseFloat(sizeSelect.value)
        : parseFloat(row.dataset.price || row.querySelector(".price")?.textContent);

      const sizeLabel = sizeSelect ? sizeSelect.selectedOptions[0].text : "";
      const itemLabel = sizeSelect ? `${item} (${sizeLabel})` : item;

      addToCart(itemLabel, price, qty);
      renderCart();
    };
  });

  // تفعيل تحديث السعر والإجمالي داخل الكتالوج
  document.querySelectorAll("tr[data-item]").forEach(row => {
    const sizeSelect = row.querySelector(".size");
    const qtyInput = row.querySelector(".qty");
    const priceCell = row.querySelector(".price");
    const totalCell = row.querySelector(".total-cell");

    function updateRowTotal() {
      const price = sizeSelect ? parseFloat(sizeSelect.value) : parseFloat(row.dataset.price);
      const qty = parseInt(qtyInput.value || "1");
      priceCell.textContent = `${price}₪`;
      totalCell.textContent = `${(price * qty).toFixed(2)}₪`;
    }

    if (sizeSelect) sizeSelect.onchange = updateRowTotal;
    if (qtyInput) qtyInput.oninput = updateRowTotal;

    updateRowTotal(); // تحديث أولي عند التحميل
  });

  renderCart();
};
