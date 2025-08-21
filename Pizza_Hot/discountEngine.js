// discountEngine.js – محرك الخصومات الذكية
const DiscountEngine = (() => {
  let rules = [];

  function addRule(name, conditionFn, applyFn){
    rules.push({ name, conditionFn, applyFn });
  }

  function apply(total, cart, user){
    let finalTotal = total;
    let applied = [];

    rules.forEach(rule => {
      if (rule.conditionFn(total, cart, user)) {
        finalTotal = rule.applyFn(finalTotal);
        applied.push(rule.name);
      }
    });

    return { total: Math.round(finalTotal), applied };
  }

  return {
    addRule,
    apply
  };
})();
