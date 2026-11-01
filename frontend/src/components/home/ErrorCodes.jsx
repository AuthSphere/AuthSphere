import React from "react";

const ErrorCodeRow = ({ error }) => {
  return (
    <div className="flex items-center justify-between gap-4 p-3.5 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border border-border/60 shrink-0">
          {error.code}
        </span>
        <span className="text-xs font-medium text-foreground truncate">
          {error.message}
        </span>
      </div>
      <span className="text-xs text-muted-foreground truncate hidden sm:inline-block max-w-[200px]">
        {error.description}
      </span>
    </div>
  );
};

const ErrorCodes = ({ errorCodes = [] }) => {
  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden shadow-xs">
      <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Standard Error Spec
        </span>
        <span className="text-[11px] font-mono text-muted-foreground">
          RFC 6749
        </span>
      </div>

      <div className="flex flex-col max-h-80 overflow-y-auto">
        {errorCodes.map((err) => (
          <ErrorCodeRow key={err.code} error={err} />
        ))}
      </div>
    </div>
  );
};

export default ErrorCodes;
