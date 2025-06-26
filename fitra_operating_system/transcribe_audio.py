# transcribe_audio.py
# سكربت بسيط لاستخدام whisper لتحويل ملف صوتي إلى نص

import whisper
import os
import sys

def transcribe_audio(file_path):
    if not os.path.exists(file_path):
        print(f"❌ الملف غير موجود: {file_path}")
        return

    model = whisper.load_model("base")  # يمكنك اختيار: tiny, base, small, medium, large
    print(f"📥 جاري تحليل الملف: {file_path}")
    result = model.transcribe(file_path)

    print("\n📜 النص المستخرج:")
    print(result["text"])

    # حفظ النتيجة تلقائيًا في ملف txt
    output_path = os.path.splitext(file_path)[0] + "_transcript.txt"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(result["text"])

    print(f"\n✅ تم حفظ النص في: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("🔧 الاستخدام:\n  python transcribe_audio.py samples/audio_sample.mp3")
    else:
        transcribe_audio(sys.argv[1])
