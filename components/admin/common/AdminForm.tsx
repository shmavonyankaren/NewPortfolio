"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type FormEvent, type ReactNode } from "react";
import { TranslationEditor } from "./TranslationEditor";

type FormState = {
  blocked: boolean;
  busy: boolean;
  canAct: () => boolean;
  beginUpload: () => () => void;
};
const FormContext = createContext<FormState | null>(null);

function fieldsValid(form: HTMLFormElement | null) {
  if (!form) return false;
  return Array.from(form.elements).every(element => {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) return true;
    if (!element.willValidate) return true;
    return element.validity.valid && (!element.required || element.value.trim().length > 0);
  });
}

export function useAdminUpload() {
  const context = useContext(FormContext);
  return context?.beginUpload ?? (() => () => {});
}

export default function AdminForm({ children, onSubmit, className, complete = true, pendingEdits = false, busy = false, contentType, record, onRecordChange }: {
  contentType?: string;
  // Each existing form retains its own strongly typed state and submit contract.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRecordChange?: (value: any) => void;
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  className?: string;
  complete?: boolean;
  pendingEdits?: boolean;
  busy?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [language, setLanguage] = useState("en");
  const uploads = useRef(new Set<symbol>());
  const saving = useRef(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [valid, setValid] = useState(false);
  const refreshValidity = () => setValid(fieldsValid(formRef.current));
  // Controlled values and conditional fields can change without a DOM input event.
  useLayoutEffect(refreshValidity);
  const beginUpload = useCallback(() => {
    const token = Symbol();
    uploads.current.add(token);
    setUploadCount(uploads.current.size);
    return () => {
      uploads.current.delete(token);
      setUploadCount(uploads.current.size);
    };
  }, []);
  const canAct = () => !busy && !saving.current && uploads.current.size === 0;
  const blocked = busy || submitting || uploadCount > 0 || !valid || !complete || pendingEdits;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canAct() || !complete || pendingEdits || !fieldsValid(formRef.current)) return;
    saving.current = true;
    setSubmitting(true);
    try { await onSubmit(event); }
    finally { saving.current = false; setSubmitting(false); }
  }
  const message = uploadCount > 0 ? "Wait for uploads to finish before saving."
    : submitting || busy ? "Saving..."
    : pendingEdits ? "Save or cancel the open section before saving this record."
    : !valid || !complete ? "Complete all required fields with valid values before saving." : "";
  return (
    <FormContext.Provider value={{ blocked, busy: busy || submitting || uploadCount > 0, canAct, beginUpload }}>
      <form ref={formRef} onSubmit={submit} onInput={refreshValidity} onChange={refreshValidity} className={className} aria-busy={uploadCount > 0 || submitting || busy}>
        {contentType && <div role="tablist" aria-label="Content language" className="flex gap-2 border-b border-slate-200 pb-3 dark:border-white/10">
          {[["en", "English"], ["de", "Deutsch"]].map(([code, label]) => <button key={code} id={contentType + "-tab-" + code} aria-controls={contentType + "-panel-" + code} role="tab" aria-selected={language === code} type="button" disabled={pendingEdits || uploadCount > 0} onClick={() => setLanguage(code)} className={"rounded px-4 py-2 font-medium " + (language === code ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white")}>{label}</button>)}
        </div>}
        <div id={contentType + "-panel-en"} role={contentType ? "tabpanel" : undefined} aria-labelledby={contentType ? contentType + "-tab-en" : undefined} hidden={language !== "en"} className="space-y-4">{children}</div>
        {language === "de" && contentType && onRecordChange && <div id={contentType + "-panel-de"} role="tabpanel" aria-labelledby={contentType + "-tab-de"} className="space-y-4">
          <TranslationEditor model={contentType} record={record} onChange={onRecordChange} />
          <AdminSaveButton className="rounded bg-green-600 px-6 py-2 font-semibold text-white">Save record</AdminSaveButton>
        </div>}
        {message && <p role="status" className="text-sm text-slate-600 dark:text-slate-400">{message}</p>}
      </form>
    </FormContext.Provider>
  );
}

export function AdminSaveButton({ disabled, className, onClick, type = "submit", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = useContext(FormContext);
  const blocked = disabled || (type === "submit" ? context?.blocked : context?.busy);
  return <button {...props} type={type} disabled={blocked} className={`${className ?? ""} disabled:opacity-50 disabled:cursor-not-allowed`}
    onClick={event => {
      if (blocked || (context && !context.canAct())) { event.preventDefault(); return; }
      onClick?.(event);
    }} />;
}
