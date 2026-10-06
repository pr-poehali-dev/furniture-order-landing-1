import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { getProjectText, saveProjectText } from "@/lib/siteImages";

const MAX = 2000;

export default function ProjectDescriptionEditor({ projectKey }: { projectKey: string }) {
  const saved = getProjectText(projectKey);
  const [text, setText] = useState(saved);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  useEffect(() => {
    setText(saved);
  }, [saved]);

  const dirty = text.trim() !== saved;

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const result = await saveProjectText(projectKey, text);
      setText(result);
      setStatus("ok");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-3">
      <label className="text-xs font-semibold text-gray-600 mb-1 block">Описание работы</label>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value.slice(0, MAX));
          setStatus("idle");
        }}
        rows={3}
        placeholder="Например: кухня для семьи из 4 человек, фасады МДФ эмаль, встроенная техника Bosch, срок изготовления 25 дней"
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 resize-y focus:outline-none focus:border-orange-500"
      />
      <div className="flex items-center justify-between mt-1.5 gap-2">
        <span className="text-[11px] text-gray-400">{text.length} / {MAX}</span>
        <div className="flex items-center gap-2">
          {status === "ok" && !dirty && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <Icon name="Check" size={12} /> Сохранено
            </span>
          )}
          {status === "error" && <span className="text-xs text-red-500">Не сохранилось</span>}
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Сохраняю..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
