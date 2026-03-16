sap.ui.define(["sap/ui/core/UIComponent", "sap/m/MessageToast", "sap/ui/model/json/JSONModel", "./BaseController"], function (UIComponent, MessageToast, JSONModel, __BaseController) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace notes.controller
   */
  const NotesList = BaseController.extend("notes.controller.NotesList", {
    onInit: function _onInit() {
      // Create a view model for controlling edit mode
      const oViewModel = new JSONModel({
        editMode: false,
        hasSelection: false
      });
      this.getView()?.setModel(oViewModel, "view");
      const oModel = this.getView()?.getModel();
      if (!oModel) {
        console.error("ODataModel not found");
        return;
      }
      oModel.setDefaultBindingMode("TwoWay");
    },
    onEdit: function _onEdit() {
      this.setEditMode(true);
    },
    onSelectionChange: function _onSelectionChange() {
      const oTable = this.byId("NotesTable");
      const hasSelection = oTable.getSelectedItems().length > 0;
      const oViewModel = this.getView()?.getModel("view");
      oViewModel.setProperty("/hasSelection", hasSelection);
    },
    onFilterNotes: function _onFilterNotes(event) {
      const query = event.getParameter("query") || "";
      this.filterTableByQuery("NotesTable", "title", query);
    },
    onPress: function _onPress(event) {
      const item = event.getSource();
      const bindingContext = item.getBindingContext();
      if (!bindingContext) return;
      const router = UIComponent.getRouterFor(this);
      const sId = bindingContext.getProperty("ID");
      router.navTo("NotesDetail", {
        noteId: sId
      });
    },
    onAddNote: function _onAddNote() {
      const oModel = this.getView()?.getModel();
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
        error: err => console.error("Create failed", err)
      });

      // Set edit mode on if not already
      this.setEditMode(true);
    },
    onDeleteNote: function _onDeleteNote() {
      const oTable = this.byId("NotesTable");
      const aSelectedItems = oTable.getSelectedItems();
      if (!aSelectedItems.length) {
        MessageToast.show("Please select note(s) to delete");
        return;
      }
      const oModel = this.getView().getModel();
      if (!oModel) return;

      // Delete each selected entry via its binding context
      aSelectedItems.forEach(oItem => {
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
      const oViewModel = this.getView()?.getModel("view");
      oViewModel.setProperty("/hasSelection", false);
    },
    onSave: function _onSave() {
      const oModel = this.getView()?.getModel();
      const oTable = this.byId("NotesTable");
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
    },
    onCancel: function _onCancel() {
      const oTable = this.byId("NotesTable");
      this.resetChanges();
      oTable.getBinding("items").refresh(true);
      this.setEditMode(false);
    }
  });
  return NotesList;
});
//# sourceMappingURL=NotesList-dbg.controller.js.map
