"use client";

type Props = {
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export default function ButtonsSection({
  saving,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="mt-10 flex flex-wrap gap-4">

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-cyan-500 px-8 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:opacity-50"
      >
        {saving
          ? "Opslaan..."
          : "💾 Duik opslaan"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-slate-600 px-8 py-3 transition hover:bg-slate-800"
      >
        Annuleren
      </button>

    </div>
  );
}