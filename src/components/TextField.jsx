import React from "react";

// Input berlabel yang dipakai ulang di form auth, profil, dan modal.
export default function TextField({
  id,
  label,
  icon: Icon,
  error,
  multiline = false,
  className = "",
  ...inputProps
}) {
  const Element = multiline ? "textarea" : "input";
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-3 text-slate-500"
          />
        )}
        <Element
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`w-full rounded-xl border bg-white py-2.5 pr-3.5 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            Icon ? "pl-10" : "pl-3.5"
          } ${error ? "border-rose-400 focus:border-rose-500" : "border-slate-300 focus:border-blue-700"}`}
          {...inputProps}
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
