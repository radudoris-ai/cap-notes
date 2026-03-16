import UIComponent from "sap/ui/core/UIComponent";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import BaseController from "./BaseController";
import formatter from "../model/formatter";

/**
 * @namespace ui5.notes.controller
 */
export default class Detail extends BaseController {
    //export default BaseController.extend("notes.controller.Detail", {

    public formatter = formatter;

    onInit(): void {

        const oViewModel = new JSONModel({ editMode: false });
        const oView = this.getView();
        if (oView) {
            oView.setModel(oViewModel, "view");
        }

        const router = UIComponent.getRouterFor(this);
        router.getRoute("NotesDetail")?.attachPatternMatched(this.onObjectMatched, this);
    }

    onObjectMatched(event: Route$PatternMatchedEvent): void {
        const sId = event.getParameter("arguments" as any).noteId;
        this.getView()?.bindElement({
            path: "/Notes(ID='" + sId + "')",
            parameters: {
                $expand: "tasks($expand=status)"
            }
        });
    }

    onFilterTasks(event: any): void {
        const query = event.getParameter("query");
        this.filterTableByQuery("TasksTable", "description", query);
    }

    onEdit(): void {
        this.setEditMode(true);
    }

    onCancel() {
        const oTable = this.byId("TasksTable")!;
        //  const oModel = this.getView()!.getModel() as ODataModel;

        //  oModel.resetChanges(); // this undoes all unsaved edits
        this.resetChanges();
        oTable.getBinding("items")!.refresh(true);
        this.setEditMode(false);
    }

    async onSave(): Promise<void> {
        const oModel = this.getView()?.getModel() as ODataModel;

        console.log("Pending changes:", oModel.getPendingChanges());
        /* const oInput = this.byId("myInput") as sap.m.Input;
         const oBinding = oInput?.getBinding("value");
         console.log(oBinding); */

        oModel.submitChanges({
            success: () => {
                console.log("Changes saved successfully", "oModel:", oModel);

                //  this.getView()?.getElementBinding()?.refresh(true);
                // oModel.refresh(true);

            },
            error: (oError: any) => {
                console.error("Save failed:", oError);
            }
        });
        this.setEditMode(false);
    }

    /**
     * Add a new Task row in the Tasks table
     */
    onAddTask(): void {
        const oModel = this.getView()?.getModel() as ODataModel;
        const oContext = this.getView()!.getBindingContext()!;

        oModel.create(`${oContext.getPath()}/tasks`, {
            description: "",
            duedate: null,
            status: { code: "N" }
        }, {
            success: () => console.log("Task created"),
            error: (err: unknown) => console.error("Create failed", err)
        });
    }
    public onDeleteAllTasks = async (): Promise<void> => {
        await this.callBoundAction("/Notes_deleteAllTasks", "TasksTable");
    }

    public onCheckDueTasks = async (): Promise<void> => {
        await this.callBoundAction("/Notes_checkDueTasks", "TasksTable");
    }

  /*  formatHighlight(status: string): string {
        switch (status) {
            case "D":
                return "Indication04"; // green
            case "I":
                return "Indication03"; // orange
            case "N":
                return "Indication05"; // blue
            default:
                return "None";
        }
    }

    formatStatusIcon(status: string): string {
        switch (status) {
            case "D":
                return "sap-icon://sys-enter-2";
            case "I":
                return "sap-icon://alert";
            case "N":
                return "sap-icon://information";
            default:
                return "";
        }
    }

    formatStatusState(status: string): string {
        switch (status) {
            case "D":
                return "Success";
            case "I":
                return "Warning";
            case "N":
                return "Information";
            default:
                return "None";
        }
    } */

 onStatusChange(oEvent: any) {
        
        const oSelect = oEvent.getSource();
        const sStatus = oSelect.getSelectedKey();

       const oItem = oSelect.getParent() as any; // ColumnListItem
        const oStatus = oItem.getCells().find((c: any) => c.getId().includes("statusObject"));

        let sHighlight = "None";
        let sIcon = "";
        let sState = "None";

        console.log("<<<<<<<<<<<<<status", sStatus);

        switch (sStatus) {
            case "D":
                sHighlight = "Indication04"; // green
                sIcon = "sap-icon://sys-enter-2";
                sState = "Success";
                break;
            case "I":
                sHighlight = "Indication03"; // orange
                sIcon = "sap-icon://alert";
                sState = "Warning";
                break;
            case "N":
                sHighlight = "Indication05"; // blue
                sIcon = "sap-icon://information";
                sState = "Information";
                break;
        }

        oItem.setHighlight(sHighlight);
        oStatus.setIcon(sIcon);
        oStatus.setState(sState); 
    }

}
