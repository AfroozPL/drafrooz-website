import { google } from "googleapis";

/**
 * Creates a Google Calendar event with an auto-generated Google Meet link
 * on the owner's primary calendar. Throws if Google env vars are missing.
 */
export async function createCalendarEvent(opts: {
  summary: string;
  description?: string;
  startIso: string;
  endIso: string;
  attendeeEmail?: string;
  timezone?: string;
}) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Google Calendar env vars missing (GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN)",
    );
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2 });

  const response = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary: opts.summary,
      description: opts.description,
      start: {
        dateTime: opts.startIso,
        timeZone: opts.timezone ?? "Australia/Brisbane",
      },
      end: {
        dateTime: opts.endIso,
        timeZone: opts.timezone ?? "Australia/Brisbane",
      },
      attendees: opts.attendeeEmail ? [{ email: opts.attendeeEmail }] : undefined,
      conferenceData: {
        createRequest: {
          requestId: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    },
  });

  const eventId = response.data.id ?? null;
  const meetLink =
    response.data.hangoutLink ??
    response.data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video",
    )?.uri ??
    "";

  return { eventId, meetLink };
}
