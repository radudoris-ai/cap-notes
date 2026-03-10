// BaseController.ts
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import UIComponent from "sap/ui/core/UIComponent";
import History from "sap/ui/core/routing/History";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";

/**
 * @namespace ui5.notes.controller
 */

export default class BaseController extends Controller {
    /** Get router */
    getRouter() {
        return UIComponent.getRouterFor(this);
    }

    /** Navigate back */
    onNavBack(): void {
        const history = History.getInstance();
        const previousHash = history.getPreviousHash();
        if (previousHash) {
            window.history.go(-1);
        } else {
            this.getRouter().navTo("NotesList", {}, true);
        }
    }

    /** Get view model */
    getViewModel(): JSONModel {
        return this.getView()!.getModel("view") as JSONModel;
    }

    /** Toggle edit mode */
    setEditMode(bEdit: boolean) {
        this.getViewModel().setProperty("/editMode", bEdit);
    }

    /** Get default OData model */
    getODataModel(): ODataModel {
        return this.getView()!.getModel() as ODataModel;
    }

    /** Filter a table by a field */
    filterTableByQuery(sTableId: string, sField: string, query: string) {
        const oTable = this.byId(sTableId);
        if (!oTable) return;

        const oBinding = oTable.getBinding("items") as ListBinding | undefined;
        if (!oBinding) return;

        const aFilters = query ? [new Filter(sField, FilterOperator.Contains, query)] : [];
        oBinding.filter(aFilters);
    }

    /** Reset all pending changes on OData model */
    resetChanges() {
        const oModel = this.getODataModel();
        oModel.resetChanges();
    }

    /** Submit OData changes with success/error logging */
    submitChanges(): Promise<void> {
        return new Promise((resolve, reject) => {
            const oModel = this.getODataModel();
            console.log("Pending changes:", oModel.getPendingChanges());

            oModel.submitChanges({
                success: () => {
                    console.log("Changes saved successfully");
                    resolve();
                },
                error: (err: any) => {
                    console.error("Save failed:", err);
                    reject(err);
                }
            });
        });
    }

    /** Bind element with optional expand */
    bindElement(sPath: string, sExpand?: string) {
        this.getView()?.bindElement({
            path: sPath,
            parameters: sExpand ? { $expand: sExpand } : undefined
        });
    }

    public callBoundAction = async (
        sActionName: string,
        sTableId?: string
    ): Promise<void> => {
        const oView = this.getView();
        if (!oView) return;

        const oModel = oView.getModel() as ODataModel;
        const oContext = oView.getBindingContext();
        if (!oContext) return;

        const sId = oContext.getProperty("ID");

        oModel.callFunction(sActionName, {
            method: "POST",
            urlParameters: { ID: sId },
            success: () => {
                console.log(`Action ${sActionName} executed successfully`);
                if (sTableId) {
                    this.byId(sTableId)?.getBinding("items")?.refresh(true);
                }
            },
            error: (err: any) => {
                console.error(`Action ${sActionName} failed:`, err);
            }
        });
    }
}
