 
import React from "react";

const SchemaNode = ({ title, label, icon: Icon, fields }) => (
  <div className="flex flex-col bg-card p-5 border-r border-b border-border last:border-r-0 hover:bg-muted/20 transition-colors">
    <div className="flex items-center gap-2.5 mb-3">
      <div className="h-7 w-7 rounded bg-muted flex items-center justify-center shrink-0 border border-border/60">
        <Icon className="h-3.5 w-3.5 text-foreground/80" />
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider leading-none">
          {label}
        </p>
        <h3 className="text-sm font-semibold text-foreground mt-0.5">
          {title}
        </h3>
      </div>
    </div>

    <div className="flex flex-col gap-1.5 font-mono text-xs mt-2 pt-2 border-t border-border/40">
      {fields.map((field) => (
        <div
          key={field.id}
          className="flex items-center justify-between py-1 text-[11px]"
        >
          <span className="text-muted-foreground">{field.id}</span>
          <span className="text-[10px] text-muted-foreground/80 bg-muted px-1.5 py-0.2 rounded border border-border/40">
            {field.type}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const DataModel = ({ schemas = [] }) => (
  <section className="py-20">
    <div className="mx-auto w-[92%] max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Data Primitives
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Normalized schemas indexed for O(1) session resolution.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>AES-256 encrypted at rest</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-border rounded-lg overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-border">
        {schemas.map((schema) => (
          <SchemaNode key={schema.title} {...schema} />
        ))}
      </div>
    </div>
  </section>
);

export default DataModel;
