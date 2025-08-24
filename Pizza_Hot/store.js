// ✅ توليد الكتالوج من catalog.js
function renderCatalog() {
  // 🍕 البيتزا
  const pizzaTable = document.querySelector("#pizza-menu tbody");
  catalog.pizza.forEach(item => {
    const row = document.createElement("tr");
    row.dataset.item = item.name;
    row.innerHTML = `
      <td>${item.name}</td>
      <td>
        <select class="size">
          ${Object.entries(item.sizes).map(([label, price]) =>
            `<option value="${price}">${label} – ${price}₪</option>`
          ).join("")}
        </select>
      </td>
      <td><span class="price">${item.sizes.XL}₪</span></td>
      <td><input class="qty" type="number" min="1" value="1"></td>
      <td class="total-cell">${item.sizes.XL}₪</td>
      <td><button class="add-btn">أضف</button></td>
    `;
    pizzaTable.appendChild(row);
  });

  // 🍟 الأطباق الجانبية
  const sidesTable = document.querySelector("#sides-menu tbody");
  catalog.sides.forEach(item => {
    const row = document.createElement("tr");
    row.dataset.item = item.name;
    row.dataset.price = item.price;
    row.innerHTML = `
      <td>${item.name}</td>
      <td><span class="price">${item.price}₪</span></td>
      <td><input class="qty" type="number" min="1" value="1"></td>
      <td class="total-cell">${item.price}₪</td>
      <td><button class="add-btn">أضف</button></td>
    `;
    sidesTable.appendChild(row);
  });

  // 🥤 المشروبات
  const drinksTable = document.querySelector("#drinks-menu tbody");
  catalog.drinks.forEach(item => {
    const row = document.createElement("tr");
    row.dataset.item = item.name;
    row.dataset.price = item.price;
    row.innerHTML = `
      <td>${item.name}</td>
      <td><span class="price">${item.price}₪</span></td>
      <td><input class="qty" type="number" min="1" value="1"></td>
      <td class="total-cell">${item.price}₪</td>
      <td><button class="add-btn">أضف</button></td>
    `;
    drinksTable.appendChild(row);
  });
}

// ✅ بدء تحميل الصفحة
window.onload = () => {
  renderCatalog(); // ✅ الجديد
  loadDiscountRules();
  initAutoDiscount();
  restoreUserData();
  enableEnterToSend();
  enableCopyOnClick();
  bindCartEvents();
  bindQuantityAndSizeEvents();
  renderCart();
};
