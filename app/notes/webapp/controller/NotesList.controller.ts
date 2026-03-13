import { SearchField$SearchEvent } from "sap/m/SearchField";
import UIComponent from "sap/ui/core/UIComponent";
import Event from "sap/ui/base/Event";
import ObjectListItem from "sap/m/ObjectListItem";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import MessageToast from "sap/m/MessageToast";
import Table from "sap/m/Table";
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import Context from "sap/ui/model/odata/v2/Context";
import ColumnListItem from "sap/m/ColumnListItem";

/**
 * @namespace notes.controller
 */
export default class NotesList extends BaseController {

    onInit(): void {

        // Create a view model for controlling edit mode
        const oViewModel = new JSONModel({
            editMode: false,
            hasSelection: false
        });
        this.getView()?.setModel(oViewModel, "view");
        const oModel = this.getView()?.getModel() as ODataModel;
        if (!oModel) {
            console.error("ODataModel not found");
            return;
        }
        oModel.setDefaultBindingMode("TwoWay");
    }

    onEdit(): void {
        this.setEditMode(true);
    }

    onSelectionChange(): void {
        const oTable = this.byId("NotesTable") as Table;
        const hasSelection = oTable.getSelectedItems().length > 0;

        const oViewModel = this.getView()?.getModel("view") as JSONModel;
        oViewModel.setProperty("/hasSelection", hasSelection);

    }

    onFilterNotes(event: SearchField$SearchEvent): void {
        const query = event.getParameter("query") || "";
        this.filterTableByQuery("NotesTable", "title", query);
    }

    onPress(event: Event): void {
        const item = event.getSource() as ObjectListItem;
        const bindingContext = item.getBindingContext();
        if (!bindingContext) return;

        const router = UIComponent.getRouterFor(this);

        const sId = bindingContext.getProperty("ID");
        router.navTo("NotesDetail", {
            noteId: sId
        });

    }

    onAddNote(): void {
        const oModel = this.getView()?.getModel() as ODataModel;
        if (!oModel) return;
        /*  const oTable = this.byId("NotesTable") as Table;
          const oBinding = oTable.getBinding("items") as ODataListBinding;
  
          const oContext = oBinding.create({
              title: "",
              description: ""
          }); */

        oModel.create("/Notes", {
            description: "",
            title: ""
        }, {
            success: () => console.log("Task created"),
            error: (err: unknown) => console.error("Create failed", err)
        });


        // Set edit mode on if not already
        this.setEditMode(true);
    }

    onDeleteNote(): void {
        const oTable = this.byId("NotesTable") as Table;
        const aSelectedItems = oTable.getSelectedItems();

        if (!aSelectedItems.length) {
            MessageToast.show("Please select note(s) to delete");
            return;
        }

        const oModel = this.getView()!.getModel() as ODataModel;
        if (!oModel) return;

        // Delete each selected entry via its binding context
        aSelectedItems.forEach((oItem) => {
            const oContext = oItem.getBindingContext();
            if (oContext) {
                oModel.remove(oContext.getPath(), {
                    success: () => {
                        MessageToast.show("Note deleted");
                    },
                    error: () => {
                        MessageToast.show("Error deleting note");
                    }
                });
            }
        });

        // Clear selection after delete
        oTable.removeSelections(true);

        const oViewModel = this.getView()?.getModel("view") as JSONModel;
        oViewModel.setProperty("/hasSelection", false);
    }
    onSave(): void {
        const oModel = this.getView()?.getModel() as ODataModel;
        const oTable = this.byId("NotesTable") as Table;
        const aItems = oTable.getItems();

        /*if (!oModel) {
            console.error("ODataModel not found");
            return;
        }
        oModel.setDefaultBindingMode("TwoWay"); */

        console.log("Pending changes:", oModel.getPendingChanges());
        // oModel.setUseBatch(true);
        oModel.submitChanges({
            success: () => {
                MessageToast.show("Changes saved");
            },
            error: () => {
                MessageToast.show("Error saving changes");
            }
        });
        this.setEditMode(false);
    }

    public onCancel(): void {
        const oTable = this.byId("NotesTable")!;
        this.resetChanges();

        oTable.getBinding("items")!.refresh(true);
        this.setEditMode(false);
    }

}