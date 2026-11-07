import React from "react";

const DocsSidebar = ({ sections, activeSection, onNavigate, isOpen }) => {
  return (
    <aside
      className={`
      fixed inset-0 z-40 bg-white/95 dark:bg-[#09090c]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none
      md:sticky md:top-28 md:h-[calc(100vh-120px)] md:block w-64 shrink-0 border-r border-neutral-200 dark:border-[#222329] p-4 transition-transform duration-200 overflow-y-auto
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}
    >
      <div className="space-y-1">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-3 py-2">
          DOCUMENTATION INDEX
        </div>
        {sections.map((s, idx) => {
          const isActive = activeSection === s.id;
          const indexNum = String(idx + 1).padStart(2, "0");
          return (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-all text-left cursor-pointer ${
                isActive
                  ? "bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#15161c] hover:text-black dark:hover:text-white"
              }`}
            >
              <span
                className={`text-[10px] ${isActive ? "opacity-75" : "text-neutral-400"}`}
              >
                [{indexNum}]
              </span>
              <span className="truncate">{s.title}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default DocsSidebar;
