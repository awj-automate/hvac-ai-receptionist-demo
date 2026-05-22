import { google } from "googleapis";

import { getGoogleAuth } from "@/lib/booking";
import type { CallSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Appends the booking as a row to the configured Google Sheet. */
export async function POST(req: Request) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const auth = getGoogleAuth(["https://www.googleapis.com/auth/spreadsheets"]);

  if (!auth || !spreadsheetId) {
    return Response.json(
      {
        ok: false,
        configured: false,
        message:
          "Google Sheets isn't connected yet — add the GOOGLE_SHEETS_* env vars.",
      },
      { status: 503 }
    );
  }

  let summary: Partial<CallSummary> = {};
  try {
    summary = (await req.json())?.summary ?? {};
  } catch {
    /* empty body — append a sparse row */
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const row = [
      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
      summary.customerName ?? "",
      summary.phone ?? "",
      summary.address ?? "",
      summary.issue ?? "",
      summary.systemType ?? "",
      summary.systemAge ?? "",
      summary.urgency ?? "",
      summary.appointment ?? "",
      "Demo",
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Bookings!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });
    return Response.json({
      ok: true,
      message: "Booking logged to Google Sheets.",
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    });
  } catch (err) {
    console.error("[booking/google-sheets]", err);
    return Response.json(
      {
        ok: false,
        message:
          "Couldn't write to the sheet — check it's shared with the service account and has a 'Bookings' tab.",
      },
      { status: 502 }
    );
  }
}
