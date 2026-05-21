import Retell from "retell-sdk";

// Always run on demand — the response depends on server env + a fresh token.
export const dynamic = "force-dynamic";

/**
 * Creates a Retell web call and returns a short-lived access token. The token
 * must be used by the browser SDK within ~30 seconds of issue.
 *
 * The Retell API key never reaches the client — it stays in this route handler.
 */
export async function POST() {
  const apiKey = process.env.RETELL_API_KEY;
  const agentId = process.env.RETELL_AGENT_ID;

  if (!apiKey || !agentId) {
    return Response.json(
      {
        error:
          "Retell is not configured. Set RETELL_API_KEY and RETELL_AGENT_ID.",
      },
      { status: 503 }
    );
  }

  try {
    const retell = new Retell({ apiKey });
    const webCall = await retell.call.createWebCall({ agent_id: agentId });
    return Response.json({ access_token: webCall.access_token });
  } catch (err) {
    console.error("[retell-token] failed to create web call:", err);
    return Response.json(
      { error: "Could not start the call. Please try again." },
      { status: 502 }
    );
  }
}
