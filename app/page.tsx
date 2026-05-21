import { DemoApp } from "@/components/demo-app";

// Read env at request time so deploys pick up dashboard env-var changes
// without a rebuild.
export const dynamic = "force-dynamic";

export default function Home() {
  // Server-only check — keys never reach the client, just this boolean does.
  const retellConfigured = Boolean(
    process.env.RETELL_API_KEY && process.env.RETELL_AGENT_ID
  );

  return <DemoApp retellConfigured={retellConfigured} />;
}
