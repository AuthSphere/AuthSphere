import React from "react";

const DocsSidebar = ({ sections, activeSection, onNavigate, isOpen }) => {
  return (
    <aside
      className={`
      fixed inset-0 z-40 bg-background/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none
      md:sticky md:top-28 md:h-[calc(100vh-112px)] md:block w-64 md:w-64 border-2 p-6 transition-transform duration-300 h-fit mt-14
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}
    >
      <div className="space-y-1 py-1">
        <p className="text-xs font-bold text-muted-foreground uppercase mb-4 px-3 tracking-wider">
          Documentation
        </p>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === s.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <s.icon className="h-4 w-4" />
            {s.title}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default DocsSidebar;
