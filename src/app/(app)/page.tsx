import { KpiCard } from "@/components/dashboard/kpi-card";
import { RecentEvents } from "@/components/dashboard/recent-events";
import { TrendsChart } from "@/components/dashboard/trends-chart";
import {
  Activity,
  ShieldAlert,
  ListChecks,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Events (24h)"
          value="1,254"
          description="+20.1% from last 24h"
          Icon={Activity}
        />
        <KpiCard
          title="Critical Events"
          value="32"
          description="Awaiting acknowledgement"
          Icon={ShieldAlert}
        />
        <KpiCard
          title="Open Actions"
          value="18"
          description="7 are overdue"
          Icon={ListChecks}
        />
        <KpiCard
          title="PPE Compliance"
          value="92.8%"
          description="-1.2% from yesterday"
          Icon={Clock}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
            <TrendsChart />
        </div>
        <div className="lg:col-span-3">
          <RecentEvents />
        </div>
      </div>
    </div>
  );
}
