// fitra_engine.js
// هذا الملف يستقبل المدخلات ويقترح النماذج المناسبة

function analyzePayload(payload) {
  const modelMap = {
    image: ["MetaMesh", "Visual Story Crafter"],
    audio: ["Echo Frame"],
    video: ["Echo Frame"],
    text: ["Copy Alchemist", "Marketing Synth"]
  };

  const modelCount = {};

  payload.forEach(item => {
    const types = modelMap[item.type] || [];
    types.forEach(model => {
      modelCount[model] = (modelCount[model] || 0) + 1;
    });
  });

  // اختيار أفضل 2 نموذج بالاعتماد على عدد التطابقات
  const suggestedModels = Object.entries(modelCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(entry => entry[0]);

  // نحفظ الاختيار مؤقتًا (يمكن تطويره لاحقًا)
  sessionStorage.setItem("fitra_suggestions", JSON.stringify(suggestedModels));

  // الذهاب إلى الكاتالوج مع تفعيل النماذج المقترحة
  window.location.href = "catalog.html";
}
