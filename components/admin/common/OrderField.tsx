"use client";
export default function OrderField({ value, maximum, onChange }: {
  value?: number; maximum: number; onChange: (order: number) => void;
}) {
  return (
    <label className="block space-y-1 text-sm font-medium text-slate-900 dark:text-white">
      <span>Order</span>
      <select value={value ?? maximum} onChange={event => onChange(Number(event.target.value))}
        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white">
        {Array.from({ length: maximum }, (_, index) => index + 1).map(order =>
          <option key={order} value={order}>{order}</option>
        )}
      </select>
      <span className="block text-xs text-slate-500 dark:text-slate-400">Moving this item shifts the items between its old and new positions.</span>
    </label>
  );
}
