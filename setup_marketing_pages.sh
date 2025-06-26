#!/bin/bash

BASE="/home/ali/0_gh_repos/Product_Store"
DEST="$BASE/marketing_pages"
mkdir -p "$DEST"
cd "$DEST" || exit

titles=(
  "خطة فردية لترقية العتاد التقني"
  "استراتيجية جماعية بتمويل مشترك"
  "خطة تنفيذية لنصف الفريق"
  "سيناريو بتمويل مزدوج"
  "عرض مشروع إبداعي فردي"
  "مختبر إبداعي لثلاثة أشخاص"
  "شبكة خضراء لفريق كامل"
  "Apowork كمحرّك تنسيق تشاركي"
  "الاستدامة ومنصة Switchers"
  "ختام بصري – الموهيتو"
)

style='
body {
  background: linear-gradient(to bottom, #0e2011, #000000);
  color: #fff;
  font-family: "Tajawal", sans-serif;
  padding: 2em;
  margin: 0;
  line-height: 1.8;
  direction: rtl;
}
h1, h2 {
  color: #FF6600;
  text-shadow: 0 0 6px #FF6600;
}
a {
  color: #FFAA33;
  text-decoration: none;
  font-weight: bold;
}
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  background: rgba(0,0,0,0.85);
  padding: 12px;
  text-align: center;
  z-index: 999;
  box-shadow: 0 1px 10px #0f0;
}
nav a { margin: 0 10px; }
.glass {
  background: rgba(255,255,255,0.06);
  padding: 1.5em;
  margin: 2em 0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255,100,0,0.2);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.08);
}
'

nav_bar="<nav>"
for i in {1..10}; do
  nav_bar+="<a href='page_$(printf "%02d" $i).html'>صفحة $i</a>"
done
nav_bar+="</nav><div style='height:70px;'></div>"

# الصفحة 1 - تحليل فعلي
cat <<EOF > "page_01.html"
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${titles[0]}</title>
  <style>$style</style>
</head>
<body>
$nav_bar
<h1>${titles[0]}</h1>

<div class="glass">
  <h2>١. خلفية</h2>
  <p>في ظل الضغط المتزايد على موارد الجهاز الرئيسي (500 جيجا شبه ممتلئة، محدودية كاميرا التصوير، غياب أدوات الفبركة)، أصبح تحديث الجهاز أولوية لنقل جودة الإبداع إلى مستوى يمكن تسويقه رقميًا بشكل احترافي.</p>
</div>

<div class="glass">
  <h2>٢. الخطة</h2>
  <ul>
    <li>ترقية التخزين إلى قرص 1 تيرا أو أكثر</li>
    <li>اقتناء طابعة أو مخرطة رقمية صغيرة</li>
    <li>تحسين أدوات التصوير أو شراء حامل عدسة أو مثبت</li>
  </ul>
</div>

<div class="glass">
  <h2>٣. الأثر التسويقي</h2>
  <p>يسمح هذا التحديث بإنشاء محتوى عالي الوضوح يُستخدم في حملات المنصات، عروض المشاريع، محتوى التعليم البصري، والإعلانات التفاعلية.</p>
</div>
</body>
</html>
EOF

# الصفحات 2–9 - مبدئية
for i in {2..9}; do
  fname=$(printf "page_%02d.html" "$i")
  title="${titles[$((i-1))]}"
  cat <<EOF > "$fname"
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>$title</title>
  <style>$style</style>
</head>
<body>
$nav_bar
<h1>$title</h1>
<div class="glass">
  <p>💡 [يرجى تخصيص هذه الصفحة لتعرض سيناريو من واقع الفريق حسب التمويل أو المهارة]</p>
</div>
</body>
</html>
EOF
done

# الصفحة 10 - الموهيتو الختامي 🍹
cat <<EOF > "page_10.html"
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${titles[9]}</title>
  <style>$style</style>
</head>
<body>
$nav_bar
<h1>${titles[9]}</h1>

<div class="glass">
  <h2>🌿 الرؤية</h2>
  <p>نحن لا نبيع فكرة… بل نُعدّ مشهدًا يمكن معايشته. هذا المشروع لا يتوقف عند التمويل، بل يبدأ به. كل صفحة كانت عصارة تفكير واقعي ومرن، والمستقبل مفتوح لمن يصنعه بنبض موهيتو رقمي.</p>
</div>

<div class="glass">
  <h2>💬 التوصية</h2>
  <p>ابدأ حيث يتقاطع الشغف مع الأدوات، وحيث يكون التسويق تحليلًا قبل أن يكون عرضًا. كل شخص في الفريق يحمل بذرة، وهذه الصفحات هي البيوت الزجاجية التي تنتظر نموها.</p>
</div>
</body>
</html>
EOF

# الصفحة index
cat <<EOF > "index.html"
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>📂 فهرس الصفحات التسويقية</title>
  <style>
    body {
      background: #001100;
      color: #eee;
      font-family: "Tajawal", sans-serif;
      padding: 3em;
    }
    h1 { color: #FF6600; }
    ul { list-style-type: square; line-height: 2; }
    a { color: #FFAA33; font-weight: bold; }
  </style>
</head>
<body>
  <h1>📂 فهرس الصفحات التسويقية</h1>
  <p>كل صفحة هنا تمثل سيناريو قابل للتنفيذ حسب التمويل المتاح وعدد أفراد الفريق. الفكرة هي صناعة محتوى مقنع واستراتيجي من خلال تجربة تحليلية وميدانية.</p>
  <ul>
EOF

for i in {1..10}; do
  title="${titles[$((i-1))]}"
  fname=$(printf "page_%02d.html" "$i")
  echo "<li><a href=\"$fname\">صفحة $i – $title</a></li>" >> index.html
done

echo "</ul></body></html>" >> index.html

echo "✅ تم توليد 10 صفحات في $DEST بنجاح 🍹🟧🧊"
