import axios from "axios";
//import cds from "@sap/cds";
const xsenv = require('@sap/xsenv');

/*function getCredentials() {

  const alertService = cds.env.requires["alert-notification"];
  if (!alertService?.credentials) {
    throw new Error("Alert Notification service not bound");
  }
  return alertService.credentials;
} */

async function getAccessToken(credentials: any): Promise<string> {

  const xsuaa = xsenv.serviceCredentials({ label: "xsuaa" });
  const tokenUrl = `${xsuaa.url}/oauth/token`;

  console.log("<<<<<<<<<<tokenUrl:", tokenUrl);
  console.log("<<<<<<<<<<clientid:", credentials.client_id); 
  console.log("<<<<<<<<<<clientsecret:", credentials.client_secret); 

  if (!credentials) {
    throw new Error("Alert Notification service not configured");
  }

  const response = await axios.post(
    tokenUrl,
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      auth: {
        username: credentials.client_id,
        password: credentials.client_secret
      }
    }
  );
  console.log("<<<<<<<<<<response.data.access_token:",response);
  return response.data.access_token;
}

export async function sendAlert() {

  xsenv.loadEnv();
  const credentials = xsenv.serviceCredentials({ label: "alert-notification" });
  console.log("<<<<<<<<<<credentials:", credentials);
  const token = await getAccessToken(credentials);
  console.log("<<<<<<<<<<token:", token);

  await axios.post(
    `${credentials.url}/cf/producer/v1/resource-events`,
    {
      eventType: "my.custom.test",
      severity: "INFO",
      category: "ALERT",
      resource: {
        resourceName: "MyCAPApp",
        resourceType: "application"
      },
      subject: "Alert from CAP",
      body: "Triggered from CAP TypeScript service"
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`, 
        "Content-Type": "application/json"
      }
    }
  );

  console.log("<<<<<<<<<< the end:");
}
