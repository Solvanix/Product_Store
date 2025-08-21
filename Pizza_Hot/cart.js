// cartCore.js – وحدة إدارة السلة المركزية
const CartCore = (() => {
  let key = '', user = 'guest', carts = {}, cur = '1';

  // تهيئة السلة حسب اسم المستخدم
  function init(name){
    user = name || 'guest';
    key = 'orders_' + user;
    const d = JSON.parse(localStorage.getItem(key)||'{}');
    carts = d.carts || {'1':[]};
    cur = d.cur || '1';
  }

  // حفظ السلة في التخزين المحلي
  function save(){
    localStorage.setItem(key, JSON.stringify({ carts, cur }));
  }

  // استرجاع السلة الحالية
  function getCurrentCart(){
    return carts[cur] || [];
  }

  // إضافة صنف إلى السلة
  function add(item, price, qty, note){
    carts[cur] = carts[cur] || [];
    carts[cur].push({ item, price, qty, note });
    save();
  }

  // حذف صنف حسب الفهرس
  function remove(index){
    if (carts[cur]) {
      carts[cur].splice(index, 1);
      save();
    }
  }

  // تفريغ السلة الحالية
  function clear(){
    carts[cur] = [];
    save();
  }

  // حساب الإجمالي
  function total(){
    return getCurrentCart().reduce((sum, it) => sum + it.price * it.qty, 0);
  }

  // استرجاع كل السلال
  function getAll(){
    return { carts, cur };
  }

  // تغيير السلة الحالية
  function switchCart(name){
    if (carts[name]) {
      cur = name;
      save();
    }
  }

  // إنشاء سلة جديدة
  function createCart(name){
    if (!carts[name]) {
      carts[name] = [];
      cur = name;
      save();
    }
  }

  // حذف سلة بالكامل
  function deleteCart(name){
    delete carts[name];
    if (cur === name) cur = Object.keys(carts)[0] || '1';
    save();
  }

  return {
    init,
    save,
    add,
    remove,
    clear,
    total,
    getCurrentCart,
    getAll,
    switchCart,
    createCart,
    deleteCart
  };
})();
