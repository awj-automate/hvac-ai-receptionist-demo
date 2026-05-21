/** Mock data powering the Mode 3 dashboard. All values are illustrative. */

export interface DashboardStat {
  label: string;
  value: number;
  /** Rendered after the counted value, e.g. "s" or "%". */
  suffix: string;
  /** Decimal places to show while counting. */
  decimals?: number;
}

export const DASHBOARD_STATS: DashboardStat[] = [
  { label: "Calls answered this month", value: 312, suffix: "" },
  { label: "Service calls booked", value: 47, suffix: "" },
  { label: "Avg. answer time", value: 18, suffix: "s" },
  { label: "Answer rate", value: 94, suffix: "%" },
];

export interface WorkflowStep {
  title: string;
  detail: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { title: "Inbound call", detail: "Homeowner dials in, 24/7" },
  { title: "AI answers", detail: "Picked up in 18 seconds" },
  { title: "HVAC triage", detail: "Heat / cool / no-output check" },
  { title: "Qualification", detail: "System type, age, urgency" },
  { title: "Calendar booking", detail: "Same-day or next-day slot" },
  { title: "CRM update", detail: "Job pushed to dispatch board" },
];

export interface DispatchJob {
  id: string;
  customer: string;
  job: string;
  window: string;
  tech: string;
  priority: "Emergency" | "Standard" | "Maintenance";
}

/** Jobs already on the board when the dashboard loads. */
export const SEED_DISPATCH_JOBS: DispatchJob[] = [
  {
    id: "WO-4471",
    customer: "D. Alvarez",
    job: "No cooling — compressor",
    window: "Today 8–11 AM",
    tech: "Carlos M.",
    priority: "Emergency",
  },
  {
    id: "WO-4472",
    customer: "S. Whitfield",
    job: "Annual tune-up",
    window: "Today 11–2 PM",
    tech: "Devin R.",
    priority: "Maintenance",
  },
  {
    id: "WO-4473",
    customer: "K. Osei",
    job: "Thermostat replacement",
    window: "Today 12–3 PM",
    tech: "Carlos M.",
    priority: "Standard",
  },
];

/** Jobs the AI "books" live — fed onto the board one at a time. */
export const INCOMING_DISPATCH_JOBS: DispatchJob[] = [
  {
    id: "WO-4474",
    customer: "M. Reynolds",
    job: "AC not cooling — refrigerant",
    window: "Today 2–5 PM",
    tech: "Unassigned",
    priority: "Emergency",
  },
  {
    id: "WO-4475",
    customer: "P. Nguyen",
    job: "Furnace short-cycling",
    window: "Tomorrow 8–11 AM",
    tech: "Unassigned",
    priority: "Standard",
  },
];

export interface ActivityEvent {
  /** 12-hour timestamp string, e.g. "2:47 AM". */
  time: string;
  summary: string;
  /** True for events outside 8 AM–6 PM — highlights after-hours coverage. */
  afterHours: boolean;
}

/**
 * Seed feed for the scrolling activity panel. Timestamps deliberately span the
 * full 24-hour clock to emphasize after-hours answering.
 */
export const ACTIVITY_FEED: ActivityEvent[] = [
  {
    time: "3:12 AM",
    summary: "Inbound call answered · No heat · Booked emergency 8–11 AM",
    afterHours: true,
  },
  {
    time: "1:48 AM",
    summary: "Inbound call answered · AC not cooling · Booked today 2–5 PM",
    afterHours: true,
  },
  {
    time: "11:36 PM",
    summary: "Inbound call answered · Thermostat issue · Booked tomorrow",
    afterHours: true,
  },
  {
    time: "10:09 PM",
    summary: "Inbound call answered · Water leak at air handler · Emergency",
    afterHours: true,
  },
  {
    time: "8:21 PM",
    summary: "Inbound call answered · Tune-up request · Booked Thursday",
    afterHours: true,
  },
  {
    time: "6:54 PM",
    summary: "Inbound call answered · Strange noise from unit · Diagnostic set",
    afterHours: true,
  },
  {
    time: "2:30 PM",
    summary: "Inbound call answered · AC install quote · Estimate scheduled",
    afterHours: false,
  },
  {
    time: "11:15 AM",
    summary: "Inbound call answered · Duct cleaning · Booked next week",
    afterHours: false,
  },
];

/**
 * Pool of events that get prepended to the live feed on a timer to show the
 * board "working" during the demo.
 */
export const LIVE_FEED_POOL: Omit<ActivityEvent, "time">[] = [
  {
    summary: "Inbound call answered · No cooling upstairs · Booked same-day",
    afterHours: true,
  },
  {
    summary: "Inbound call answered · Furnace won't ignite · Emergency dispatch",
    afterHours: true,
  },
  {
    summary: "Inbound call answered · Capacitor failure · Tech en route",
    afterHours: false,
  },
  {
    summary: "Inbound call answered · Maintenance plan signup · Confirmed",
    afterHours: true,
  },
  {
    summary: "Inbound call answered · Heat pump not switching · Booked AM",
    afterHours: true,
  },
  {
    summary: "Inbound call answered · Indoor air quality quote · Estimate set",
    afterHours: false,
  },
];
