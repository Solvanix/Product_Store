(function () {
  const cartBtn = document.createElement("button");
  cartBtn.textContent = "🛒 السلة";
  Object.assign(cartBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "9999",
    padding: "10px 15px",
    background: "#b22222",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  });
  document.body.appendChild(cartBtn);

  const cartPopup = document.createElement("div");
  Object.assign(cartPopup.style, {
    position: "fixed",
    bottom: "70px",
    right: "20px",
    width: "340px",
    maxHeight: "420px",
    overflowY: "auto",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    display: "none",
    zIndex: "9999",
    fontFamily: "Tajawal, sans-serif",
  });
  document.body.appendChild(cartPopup);

  cartBtn.onclick = () => {
    cartPopup.style.display = cartPopup.style.display === "none" ? "block" : "none";
    renderFloatingCart();
  };

  function renderFloatingCart() {
    const userName = localStorage.getItem("userName") || "ضيف";
    const userAddr = localStorage.getItem("userAddr") || "";
    CartCore.init(userName);
    const cartData = CartCore.getCurrentCart();
    const rawTotal = CartCore.total();
    const { total, applied } = DiscountEngine.apply(rawTotal, cartData, userName);

    cartPopup.innerHTML = `<h4 style="margin-bottom:10px">🛍️ محتوى السلة</h4>`;
    let list = document.createElement("div");

    cartData.forEach(({ item, price, qty, note }, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.style.marginBottom = "10px";
      itemDiv.style.borderBottom = "1px solid #eee";
      itemDiv.style.paddingBottom = "6px";

      const name = document.createElement("div");
      name.textContent = `${item} ×${qty} – ${price * qty}₪`;
      name.style.fontWeight = "bold";

      const noteInput = document.createElement("input");
      noteInput.type = "text";
      noteInput.placeholder = "ملاحظة؟";
      noteInput.value = note || "";
      noteInput.style.width = "100%";
      noteInput.style.marginTop = "4px";
      noteInput.oninput = (e) => {
        cartData[index].note = e.target.value;
        CartCore.save();
        renderFloatingCart();
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️ حذف";
      Object.assign(deleteBtn.style, {
        marginTop: "6px",
        background: "#f44336",
        color: "#fff",
        border: "none",
        padding: "4px 8px",
        borderRadius: "4px",
        cursor: "pointer",
      });
      deleteBtn.onclick = () => {
        CartCore.remove(index);
        renderFloatingCart();
      };

      itemDiv.appendChild(name);
      itemDiv.appendChild(noteInput);
      itemDiv.appendChild(deleteBtn);
      list.appendChild(itemDiv);
    });

    cartPopup.appendChild(list);

    const totalDiv = document.createElement("div");
    totalDiv.textContent = `📦 الإجمالي بعد الخصم: ${total}₪`;
    totalDiv.style.marginTop = "10px";
    totalDiv.style.fontWeight = "bold";
    cartPopup.appendChild(totalDiv);

    if (applied.length) {
      const discountNote = document.createElement("div");
      discountNote.textContent = `💸 خصومات مفعّلة: ${applied.join(", ")}`;
      discountNote.style.color = "#4caf50";
      discountNote.style.marginTop = "6px";
      cartPopup.appendChild(discountNote);
    }

    const sendBtn = document.createElement("button");
    sendBtn.textContent = "📤 إرسال الطلب";
    Object.assign(sendBtn.style, {
      marginTop: "12px",
      background: "#4caf50",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
    });

    sendBtn.onclick = () => {
      const msg = MessageBuilder.build(cartData, userName, userAddr, total, applied);
      const waLink = "https://wa.me/972569788731?text=" + encodeURIComponent(msg);
      window.open(waLink, "_blank");
    };

    cartPopup.appendChild(sendBtn);
  }
})();
