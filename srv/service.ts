import cds from '@sap/cds';
import { sendAlert } from "./utils/alert";


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
           

        /*  this.after("READ", "Tasks", async (tasks: any[], req) => {
        
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