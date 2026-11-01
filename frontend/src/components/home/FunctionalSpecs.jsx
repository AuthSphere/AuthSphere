import React from "react";
import { Check } from "lucide-react";

const ModuleCard = ({ module }) => (
  <div className="flex flex-col p-6 rounded-lg border border-border bg-card">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-foreground shrink-0 border border-border/50">
        {React.cloneElement(module.icon, {
          className: "h-4 w-4 text-foreground",
        })}
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">
          {module.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Operational</span>
        </div>
      </div>
    </div>

    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
      {module.description}
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-auto pt-4 border-t border-border/50">
      {module.details.map((detail, i) => {
        const [label, ...rest] = detail.split(":");
        const body = rest.join(":").trim();
        return (
          <div
            key={i}
            className="flex items-start gap-2 p-2 rounded bg-muted/40"
          >
            <Check className="h-3 w-3 mt-0.5 text-foreground/70 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-foreground/90 truncate">
                {label.trim()}
              </p>
              {body && (
                <p className="text-[10px] text-muted-foreground truncate">
                  {body}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const FunctionalSpecs = ({ modules }) => (
  <section className="py-20 border-b border-border/40">
    <div className="mx-auto w-[92%] max-w-7xl">
      <div className="flex flex-col gap-2 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Core Subsystems
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg">
          Low-level primitives and modular architecture driving AuthSphere.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module, idx) => (
          <ModuleCard key={idx} module={module} />
        ))}
      </div>
    </div>
  </section>
);

export default FunctionalSpecs;
