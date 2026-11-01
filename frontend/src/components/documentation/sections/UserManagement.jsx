import React from "react";
import { Users } from "lucide-react";

const UserManagement = () => {
  return (
    <article className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">
          Identity Administration
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Manage the lifecycle of identities within your project namespace
          through the dashboard and administrative interfaces.
        </p>
      </div>

      <div className="space-y-8">
        {/* State Management */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            Identity State Orchestration
          </h3>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Every user entity exists in a specific state machine:{" "}
            <code>active</code>, <code>banned</code>, or <code>unverified</code>
            . Dashboard administrators can manually override these states to
            resolve verification issues or mitigate malicious actor access.
            State transitions are propagated across the cluster in real-time,
            affecting the validity of existing refresh tokens.
          </p>
        </section>

        {/* Audit Trails */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            Immutable Audit Logging
          </h3>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            All administrative actions—including state changes, password resets,
            and metadata updates—are persisted in an immutable audit log. These
            logs contain the originating administrator ID, timestamp, and a
            delta of the modified fields, providing a clear trail for security
            compliance (SOC2/GDPR).
          </p>
        </section>

        <div className="p-3 bg-muted/30 border border-muted rounded-xl flex gap-3 items-start">
          <Users size={16} className="text-primary mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-[11px] font-bold">
              Scaling identity Management
            </h5>
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              For large-scale user migrations or bulk administrative operations,
              utilize the <code>/admin</code> REST API subset. Note: This
              requires high-entropy Secret Key authentication and should never
              be exposed to front-facing client environments.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default UserManagement;
