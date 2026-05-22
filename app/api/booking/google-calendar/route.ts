import { google } from "googleapis";

import { getGoogleAuth, parseAppointmentWindow } from "@/lib/booking";
import type { CallSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Creates a Google Calendar event for the booked service appointment. */
export async function POST(req: Request) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const auth = getGoogleAuth(["https://www.googleapis.com/auth/calendar"]);

  if (!auth || !calendarId) {
    return Response.json(
      {
        ok: false,
        configured: false,
        message:
          "Google Calendar isn't connected yet — add GOOGLE_CALENDAR_ID and the service-account vars.",
      },
      { status: 503 }
    );
  }

  let summary: Partial<CallSummary> = {};
  try {
    summary = (await req.json())?.summary ?? {};
  } catch {
    /* empty body */
  }

  try {
    const { start, end, timeZone } = parseAppointmentWindow(
      summary.appointment ?? ""
    );
    const customer = summary.customerName || "New customer";
    const issue = summary.issue || "Service call";
    const description = [
      `Issue: ${summary.issue || "—"}`,
      `System: ${
        [summary.systemType, summary.systemAge].filter(Boolean).join(", ") ||
        "—"
      }`,
      `Urgency: ${summary.urgency || "—"}`,
      `Phone: ${summary.phone || "—"}`,
      `Address: ${summary.address || "—"}`,
      `Requested window: ${summary.appointment || "—"}`,
      "",
      "Booked by the AI receptionist (DataStaq demo).",
    ].join("\n");

    const calendar = google.calendar({ version: "v3", auth });
    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `${issue} — ${customer}`,
        location: summary.address || undefined,
        description,
        start: { dateTime: start, timeZone },
        end: { dateTime: end, timeZone },
      },
    });

    return Response.json({
      ok: true,
      message: "Appointment added to Google Calendar.",
      url: event.data.htmlLink ?? undefined,
    });
  } catch (err) {
    console.error("[booking/google-calendar]", err);
    return Response.json(
      {
        ok: false,
        message:
          "Couldn't create the event — check the calendar is shared with the service account.",
      },
      { status: 502 }
    );
  }
}
