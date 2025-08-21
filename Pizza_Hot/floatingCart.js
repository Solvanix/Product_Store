(function () {
  const cartBtn = document.createElement("button");
  cartBtn.textContent = "🛒 السلة";
  Object.assign(cartBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "9999",
    padding: "10px 15px",
    background: "#e91e63",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  });
  document.body.appendChild(cartBtn);

  const cartPopup = document.createElement("div");
  Object.assign(cartPopup.style, {
    position: "fixed",
    bottom: "70px",
    right: "20px",
    width: "320px",
    maxHeight: "400px",
    overflowY: "auto",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    display: "none",
    zIndex: "9999",
  });
  document.body.appendChild(cartPopup);

  cartBtn.onclick = () => {
    cartPopup.style.display = cartPopup.style.display === "none" ? "block" : "none";
    renderFloatingCart();
  };

  function renderFloatingCart() {
    const userName = localStorage.getItem("userName") || "";
    const userAddr = localStorage.getItem("userAddr") || "";
    const key = "orders_" + (userName || "guest");
    const cartData = JSON.parse(localStorage.getItem(key) || "[]");

    cartPopup.innerHTML = "<h4>🛍️ محتوى السلة</h4>";
    let total = 0;

    cartData.forEach(({ item, price, note }, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.style.marginBottom = "10px";
      itemDiv.style.borderBottom = "1px solid #eee";
      itemDiv.style.paddingBottom = "6px";

      const name = document.createElement("div");
      name.textContent = `${item} – ${price}₪`;
      name.style.fontWeight = "bold";

      const noteInput = document.createElement("input");
      noteInput.type = "text";
      noteInput.placeholder = "ملاحظة؟";
      noteInput.value = note || "";
      noteInput.style.width = "100%";
      noteInput.style.marginTop = "4px";
      noteInput.oninput = (e) => {
        cartData[index].note = e.target.value;
        localStorage.setItem(key, JSON.stringify(cartData));
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
        cartData.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(cartData));
        renderFloatingCart();
      };

      itemDiv.appendChild(name);
      itemDiv.appendChild(noteInput);
      itemDiv.appendChild(deleteBtn);
      cartPopup.appendChild(itemDiv);

      total += price;
    });

    const totalDiv = document.createElement("div");
    totalDiv.textContent = `📦 الإجمالي: ${total}₪`;
    totalDiv.style.marginTop = "10px";
    totalDiv.style.fontWeight = "bold";
    cartPopup.appendChild(totalDiv);

    const sendBtn = document.createElement("button");
    sendBtn.textContent = "📤 إرسال الطلب";
    Object.assign(sendBtn.style, {
      marginTop: "10px",
      background: "#4caf50",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer",
    });

    sendBtn.onclick = () => {
      let msg = `🍕 Pizza Hot – طلب جديد\n------------------\n`;
      msg += `👤 ${userName || "ضيف"}\n`;
      if (userAddr) msg += `📍 ${userAddr}\n`;
      msg += `\n📦 الطلب:\n`;

      cartData.forEach(({ item, price, note }) => {
        msg += `• ${item} – ${price}₪`;
        if (note) msg += ` [ملاحظة: ${note}]`;
        msg += `\n`;
      });

      msg += `\n------------------\n📦 الإجمالي الكلي: ${total}₪`;
      const waLink = "https://wa.me/972569788731?text=" + encodeURIComponent(msg);
      window.open(waLink, "_blank");
    };

    cartPopup.appendChild(sendBtn);
  }
})();
