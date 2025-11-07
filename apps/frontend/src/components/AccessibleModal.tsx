import { useEffect, useRef } from "react";


interface Props {
open: boolean;
title: string;
onClose: () => void;
children: React.ReactNode;
}


export default function AccessibleModal({ open, title, onClose, children }: Props) {
const dialogRef = useRef<HTMLDivElement>(null);
const lastActive = useRef<HTMLElement | null>(null);


useEffect(() => {
if (open) {
lastActive.current = document.activeElement as HTMLElement;
setTimeout(() => dialogRef.current?.focus(), 0);
} else if (lastActive.current) {
lastActive.current.focus();
}
}, [open]);


useEffect(() => {
function onKey(e: KeyboardEvent) {
if (!open) return;
if (e.key === "Escape") onClose();
if (e.key === "Tab") {
const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
);
if (!focusables || focusables.length === 0) return;
const first = focusables[0];
const last = focusables[focusables.length - 1];
if (e.shiftKey && document.activeElement === first) {
last.focus(); e.preventDefault();
} else if (!e.shiftKey && document.activeElement === last) {
first.focus(); e.preventDefault();
}
}
}
document.addEventListener("keydown", onKey);
return () => document.removeEventListener("keydown", onKey);
}, [open, onClose]);


if (!open) return null;


return (
<div
role="dialog"
aria-modal="true"
aria-labelledby="modal-title"
className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
onClick={(e) => e.target === e.currentTarget && onClose()}
>
<div
ref={dialogRef}
tabIndex={-1}
className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-[90%] shadow-xl outline-none"
>
<h2 id="modal-title" className="text-xl font-semibold mb-3">{title}</h2>
<div>{children}</div>
<div className="mt-6 flex justify-end">
<button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700">
SchlieÃƒÅ¸en
</button>
</div>
</div>
</div>
);
}