import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import History from "sap/ui/core/routing/History";
import { SearchField$SearchEvent } from "sap/ui/commons/SearchField";
import FilterOperator from "sap/ui/model/FilterOperator";
import Filter from "sap/ui/model/odata/Filter";
import ListBinding from "sap/ui/model/ListBinding";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import ODataContext from "sap/ui/model/odata/v4/Context";
/**
 * @namespace ui5.notes.controller
 */
export default class Detail extends Controller {

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
            path: "/Notes(ID='" + sId + "',IsActiveEntity=true)",
            parameters: {
                $expand: "tasks($expand=status)"   // <-- THIS is required in OData V4
            }
        });
    }


    onNavBack(): void {
        const history = History.getInstance();
        const previousHash = history.getPreviousHash();

        if (previousHash !== undefined) {
            window.history.go(-1);
        } else {
            const router = UIComponent.getRouterFor(this);
            router.navTo("NotesList", {}, true);
        }
    }

    onFilterTasks(event: SearchField$SearchEvent): void {
        // build filter array
        const filter = [];
        const query = event.getParameter("query");
        if (query) {
            filter.push(new Filter("description", FilterOperator.Contains, query));
        }
        // filter binding
        const list = this.byId("TasksTable");
        const binding = list?.getBinding("items") as ListBinding;
        binding?.filter(filter);
    }

    public onEdit(): void {
        const oViewModel = this.getView()!.getModel("view") as JSONModel;
        oViewModel?.setProperty("/editMode", true);

    }
    public onCancel(): void {
        const oModel = this.getView()!.getModel() as ODataModel; // OData v4 model
        oModel?.resetChanges("$auto");

        const oViewModel = this.getView()!.getModel("view") as JSONModel;
        oViewModel?.setProperty("/editMode", false);
    }

    /**
     * Save draft changes
     */
    public async onSave(): Promise<void> {
        const oView = this.getView()!;
        const oODataModel = oView.getModel() as ODataModel;

        try {
            await oODataModel.submitBatch("$auto");

            const oViewModel = oView.getModel("view") as JSONModel;
            oViewModel.setProperty("/editMode", false);
        } catch (err) {
            console.error("Error saving draft:", err);
        }


    }

    /**
     * Add a new Task row in the Tasks table
     */
    public async onAddTask(): Promise<void> {
        const oTable = this.byId("TasksTable");
        if (!oTable) return;

        const oBinding = oTable.getBinding("items");
        if (oBinding && "create" in oBinding) {
            (oBinding as ODataListBinding).create({
                description: "",
                duedate: null
            });
        }

    }

    public async onDeleteAllTasks(): Promise<void> {
        const oView = this.getView()!;
        const oModel = oView.getModel() as ODataModel;
        const oContext = oView.getBindingContext() as ODataContext;
        if (!oContext) return;

        try {
            // Create action binding relative to the Note context
            const oActionBinding = oModel.bindContext(
                "NotesService.deleteAllTasks(...)",
                oContext
            ) as any;

            await oActionBinding.execute();
            await oContext.refresh();

        } catch (error) {
            console.error("Delete all tasks failed:", error);
        }
    }

};