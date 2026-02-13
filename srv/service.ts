import cds from '@sap/cds';
const { buildHeadersForDestination } = require("@sap-cloud-sdk/connectivity");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const { getDestination } = require("@sap-cloud-sdk/connectivity");
import { sendAlert } from "./utils/alert";
import type { Service } from "@sap/cds";
import { sendNotification } from './notification'
import { matchesGlob } from 'path';

const LOG = cds.log('notifications');
const NOTIFICATIONS_API_ENDPOINT = "v2/Notification.svc";
const messages = {
    TYPES_FILE_NOT_EXISTS: "Notification Types file path is incorrect.",
    INVALID_NOTIFICATION_TYPES: "Notification Types must contain the following key: 'NotificationTypeKey'.",
    DESTINATION_NOT_FOUND: "Failed to get destination: ",
    MANDATORY_PARAMETER_NOT_PASSED_FOR_DEFAULT_NOTIFICATION: "Recipients and title are mandatory parameters.",
    MANDATORY_PARAMETER_NOT_PASSED_FOR_CUSTOM_NOTIFICATION: "Recipients are mandatory parameters.",
    RECIPIENTS_IS_NOT_ARRAY: "Recipients is not an array or it is empty.",
    TITLE_IS_NOT_STRING: "Title is not a string.",
    DESCRIPTION_IS_NOT_STRING: "Description is not a string.",
    PROPERTIES_IS_NOT_OBJECT: "Properties is not an object.",
    NAVIGATION_IS_NOT_OBJECT: "Navigation is not an object.",
    PAYLOAD_IS_NOT_OBJECT: "Payload is not an object.",
    EMPTY_OBJECT_FOR_NOTIFY: "Empty object is passed a single parameter to notify function.",
    NO_OBJECT_FOR_NOTIFY: "An object must be passed to notify function."
};

class NotesService extends cds.ApplicationService {
    init() {
        console.log("Service init started");

        const { Notes, Tasks } = this.entities;

        this.on('deleteAllTasks', Notes, async (req: cds.Request) => {
            const NoteID = req.params[0].ID;
            await DELETE.from(Tasks).where({ note_ID: NoteID });
        })

        this.on('checkDueTasks', Notes, async (req: cds.Request) => {
            try {
             //   const dbSrv = await cds.connect.to('SAP_Notifications_alert')
             //    console.log("➡️ <<<<<<<<<<<<<<<<<<<<<< dbSrv:", dbSrv);
                await sendAlert();       
                return "Alert sent successfully!";
            } catch (err) {
                if (err instanceof Error) {
                    req.error(500, err.message);
                } else {
                    req.error(500, String(err)); // fallback
                }
            }
        });


        /*     console.log("➡️ <<<<<<<<<<<<<<<<<<<<<< Update:");
            const notificationDestination = await getNotificationDestination();
            const csrfHeaders = await buildHeadersForDestination(notificationDestination, {
                url: NOTIFICATIONS_API_ENDPOINT,
            });

            try {
                LOG._info && LOG.info(
                    `Sending notification of key: ${req.data.NotificationTypeKey} and version: ${req.data.NotificationTypeVersion}`
                );
                await executeHttpRequest(notificationDestination, {
                    url: `${NOTIFICATIONS_API_ENDPOINT}/Notifications`,
                    method: "post",
                    data: req.data,
                    headers: csrfHeaders,
                });
            } catch (err: any) {
                const message: string = err?.response?.data?.error?.message?.value ?? err?.response?.message ?? 'Unexpected error';
                const error = cds.error(message);

                const axiosErr = err as any;
                const status = axiosErr?.response?.status;

                if (status && /^4\d\d$/.test(String(status)) && status !== 429) {
                    (error as any).unrecoverable = true;
                }

                throw error;
            } */


        /*    async function getNotificationDestination() {
        const destinationName = cds.env.requires.notifications?.destination ?? "SAP_Notifications";
        const notificationDestination = await getDestination({ destinationName, useCache: true });
    
        console.log("➡️ <<<<<<<<<<<<<<<<<<<<<< Destination:", notificationDestination);
    
        if (!notificationDestination) {
            // TODO: What to do if destination isn't found??
            throw new Error(messages.DESTINATION_NOT_FOUND + destinationName);
        }
        return notificationDestination;
    } */


        /*  this.after("READ", "Tasks", async (tasks: any[], req) => {
        
              console.log("➡️ <<<<<<<<<<<<<<<<<<<<<< just here");
              console.log("VCAP_SERVICES:", process.env.VCAP_SERVICES);
              console.log("ANS requires:", cds.env.requires.ans);
        
        
              if (!tasks?.length) return;
        
              console.log("➡️ <<<<<<<<<<<<<<<<<<<<<< Sending notification");
        
              const notifications = await cds.connect.to("notifications") as any;
              console.log("notifications:", notifications);
        
              const now = new Date();
              const tomorrow = new Date(now);
              tomorrow.setDate(now.getDate() + 1);
        
        
        
              for (const t of tasks) {
                  //    if (!t.dueDate || t.reminderSent) continue;
        
                  const due = new Date(t.duedate);
                  //   if (due > tomorrow) continue;
        
                  console.log("➡️ <<<<<<<<<<<<<<<<<<<<<< Sending notification to", req.user);
        
        
                  try {
                      await notifications.notify({
                          recipients: [req.user.id], // [{ RecipientId: "doris.radu@msg.group" }], //[req.user.id], //["doris.radu@msg.group"],  //[{ email: t.assignedTo }], // must be a valid user / email
                          priority: "HIGH",
                          title: `Task due soon`,
                          description: `${t.description ?? "Task"} is due on ${t.duedate}`,
                      });
                  } catch (err: unknown) {
                      console.error("Notification error:", err);
        
                      let message = "Failed to send notification";
                      if (err instanceof Error) {
                          message = err.message;
                      }
                      throw new Error(message);
                  }
        
                  await UPDATE("NotesService.Tasks")
                      .set({ remindersent: true })
                      .where({ ID: t.ID });
              }
          });
        */
        /*
                this.after('READ', 'Tasks', async (tasks: any[], req: any) => {
                    const now = new Date()
                    const tomorrow = new Date();
                    tomorrow.setDate(now.getDate() + 1);
                    console.log('<<<<<<<<<<<<<<<<<here am i>>>', tasks.length);
                    for (const t of tasks) {
                        const due = new Date(t.dueDate)
                        if (!t.reminderSent && due <= tomorrow) {
         
                            await sendNotification({
                                recipient: t.assignedTo,
                                category: "NOTIFICATION",
                                severity: "WARNING",
                                subject: `Task reminder: ${t.description ?? "Task"} (due ${t.dueDate ?? "n/a"})`,
                                body:
                                    `Task ID: ${t.ID}\n` +
                                    `Description: ${t.description ?? ""}\n` +
                                    `Due Date: ${t.dueDate ?? ""}\n` +
                                    `Assigned To: ${t.assignedTo}\n` +
                                    `Status: ${t.status?.code ?? ""}\n` +
                                    `Criticality: ${t.criticality ?? ""}\n`,
         
                            })
         
                            await UPDATE(Tasks)
                                .set({ reminderSent: true })
                                .where({ ID: t.ID });
                        }
         
                    }
                });
        */
        return super.init();
    }

}

// Register the service implementation
module.exports = { NotesService };