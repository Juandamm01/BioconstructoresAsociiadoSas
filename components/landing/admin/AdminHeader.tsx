"use client";

export function AdminHeader({ title }: { title?: string }) {
  if (!title) return null;

  return (
    <header className="header-anim sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 pl-14 md:pl-6 pr-6 py-4 flex items-center justify-between border-b border-slate-200/50 shadow-xs">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-bold text-lg leading-none text-blue-950">{title}</h1>
        </div>
      </div>
    </header>
  );
}
