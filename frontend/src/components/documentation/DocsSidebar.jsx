const DocsSidebar = ({ sections, activeSection, onNavigate, isOpen }) => {
  return (
    <aside
      className={`
      fixed inset-0 z-40 bg-background/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none
      md:sticky md:top-28 md:h-[calc(100vh-120px)] md:block w-64 shrink-0 border-r border-border p-4 transition-transform duration-200 overflow-y-auto
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}
    >
      <div className="space-y-1">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground px-3 py-2">
          DOCUMENTATION INDEX
        </div>
        {sections.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-all text-left cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="truncate">{s.title}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default DocsSidebar;
