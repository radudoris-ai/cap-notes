
import axios from "axios";

type AnsSeverity = "INFO" | "NOTICE" | "WARNING" | "ERROR" | "FATAL";

type AnsCredentials = {
  baseUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
};

function getANSCredentials(): AnsCredentials| null {
  const raw = process.env.VCAP_SERVICES;
   // Rulezi local (cds watch)
  if (!raw) {
    console.warn("[ANS] VCAP_SERVICES not found – notifications disabled (local run)");
    return null;
  }
  const vcap = JSON.parse(raw);
  const svc = vcap["alert-notification"]?.[0];

  const {
    url,
    oauth_url,
    client_id,
    client_secret
  } = svc.credentials;

  if (!url || !oauth_url  || !client_id  || !client_secret) {
    throw new Error("Alert Notification Service credentials missing in VCAP_SERVICES.");
  }
   console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ANS baseUrl:", url);

    return {
    baseUrl: url,
    tokenUrl: oauth_url,
    clientId: client_id,
    clientSecret: client_secret
  };
}


let cachedTokenValue: string | null = null
let tokenExpiry = 0

/** small in-memory token cache to avoid calling OAuth for every alert */
async function getAccessToken(creds: AnsCredentials): Promise<string> {
   if (cachedTokenValue && Date.now() < tokenExpiry) {
    return cachedTokenValue
  }

 const res = await axios.post(
    creds.tokenUrl,
    null,
    {
      auth: {
        username: creds.clientId,
        password: creds.clientSecret
      }
    }
  );

  const token = res.data?.access_token as string | undefined;
  if (!token) {
    throw new Error("OAuth token endpoint returned no access_token");
  }

  cachedTokenValue = token;
  tokenExpiry = Date.now() + Number(res.data?.expires_in ?? 300) * 1000

  return token;
}

export async function sendNotification(input: {
  recipient: string;
  subject: string;
  body: string;
  category: string;
  severity: AnsSeverity;
}): Promise<void> {

 const creds = getANSCredentials();
  if (!creds) {
    console.log("[ANS] Skipped notification (local mode)", input.subject);
    return;
  }
  const token = await getAccessToken(creds);
  console.log('<<<<<<<<<<<<<<<<<here am i - sent notif>>>>>>>', creds, token);  

  await axios.post(
    `${creds.baseUrl}/v2/alerts`,
    {
      recipients: [{ type: 'EMAIL', value: input.recipient }],
      subject: input.subject,
      body: input.body,
      category: input.category,
      severity: input.severity,
    },
    {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    }
  );

  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ANS response:", input.recipient)
}
