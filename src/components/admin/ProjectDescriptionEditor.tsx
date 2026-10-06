import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { getProjectText, saveProjectText } from "@/lib/siteImages";

interface Props {
  projectKey: string;
  label?: string;
  defaultValue?: string;
  multiline?: boolean;
  max?: number;
  placeholder?: string;
}

export default function ProjectDescriptionEditor({
  projectKey,
  label = "Описание работы",
  defaultValue = "",
  multiline = true,
  max = 2000,
  placeholder = "Например: кухня для семьи из 4 человек, фасады МДФ эмаль, встроенная техника Bosch, срок изготовления 25 дней",
}: Props) {
  const saved = getProjectText(projectKey) || defaultValue;
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
      const value = text.trim();
      const result = await saveProjectText(projectKey, value === defaultValue ? "" : value);
      setText(result || defaultValue);
      setStatus("ok");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-orange-500";

  return (
    <div className="mb-3">
      <label className="text-xs font-semibold text-gray-600 mb-1 block">{label}</label>
      {multiline ? (
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value.slice(0, max));
            setStatus("idle");
          }}
          rows={3}
          placeholder={placeholder}
          className={`${fieldClass} resize-y`}
        />
      ) : (
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value.slice(0, max));
            setStatus("idle");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && dirty && !saving && text.trim()) handleSave();
          }}
          placeholder={placeholder}
          className={fieldClass}
        />
      )}
      <div className="flex items-center justify-between mt-1.5 gap-2">
        <span className="text-[11px] text-gray-400">{text.length} / {max}</span>
        <div className="flex items-center gap-2">
          {status === "ok" && !dirty && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <Icon name="Check" size={12} /> Сохранено
            </span>
          )}
          {status === "error" && <span className="text-xs text-red-500">Не сохранилось</span>}
          <button
            onClick={handleSave}
            disabled={!dirty || saving || (!multiline && !text.trim())}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Сохраняю..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
