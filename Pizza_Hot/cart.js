// cart.js – وحدة إدارة السلة المركزية العائمة
const CartCore = (() => {
  let key = '', user = 'guest', carts = {}, cur = '1';

  function init(name){
    user = name || 'guest';
    key = 'orders_' + user;
    const d = JSON.parse(localStorage.getItem(key)||'{}');
    carts = d.carts || {'1':[]};
    cur = d.cur || '1';
    renderFloatingCart();
  }

  function save(){
    localStorage.setItem(key, JSON.stringify({ carts, cur }));
    renderFloatingCart();
  }

  function getCurrentCart(){
    return carts[cur] || [];
  }

  function add(item, price, qty, note){
    carts[cur] = carts[cur] || [];
    carts[cur].push({ item, price, qty, note });
    save();
  }

  function remove(index){
    if (carts[cur]) {
      carts[cur].splice(index, 1);
      save();
    }
  }

  function clear(){
    carts[cur] = [];
    save();
  }

  function total(){
    return getCurrentCart().reduce((sum, it) => sum + it.price * it.qty, 0);
  }

  function renderFloatingCart(){
    const cartData = getCurrentCart();
    const rawTotal = total();
    const coupon = localStorage.getItem("userCoupon") || "";
    const userName = localStorage.getItem("userName") || "زائر";
    const userAddr = localStorage.getItem("userAddress") || "";
    const { total: finalTotal, applied } = typeof DiscountEngine !== "undefined"
      ? DiscountEngine.apply(rawTotal, cartData, userName, coupon)
      : { total: rawTotal, applied: [] };

    let msg = typeof MessageBuilder !== "undefined"
      ? MessageBuilder.build(cartData, userName, userAddr, finalTotal, applied)
      : "";

    msg += `\n📦 قبل الخصم: ${rawTotal}₪`;
    msg += `\n📦 بعد الخصم: ${finalTotal}₪`;
    if (applied.length) msg += `\n💸 خصومات: ${applied.join(", ")}`;

    const box = document.getElementById("floating-cart");
    if (box) box.innerHTML = `
      <div style="font-size:0.95rem;white-space:pre-line">${msg}</div>
      <a href="https://wa.me/972569788731?text=${encodeURIComponent(msg)}" target="_blank"
         style="display:block;margin-top:10px;background:#4caf50;color:#fff;text-align:center;padding:6px;border-radius:4px;text-decoration:none">
        📤 إرسال الطلب
      </a>
    `;
  }

  return {
    init,
    save,
    add,
    remove,
    clear,
    total,
    getCurrentCart,
    renderFloatingCart
  };
})();
