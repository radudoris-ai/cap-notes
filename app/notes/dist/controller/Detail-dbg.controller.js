sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "./BaseController", "../model/formatter"], function (UIComponent, JSONModel, __BaseController, __formatter) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const formatter = _interopRequireDefault(__formatter);
  /**
   * @namespace ui5.notes.controller
   */
  const Detail = BaseController.extend("ui5.notes.controller.Detail", {
    constructor: function constructor() {
      BaseController.prototype.constructor.apply(this, arguments);
      //export default BaseController.extend("notes.controller.Detail", {
      this.formatter = formatter;
      this.onDeleteAllTasks = async () => {
        await this.callBoundAction("/Notes_deleteAllTasks", "TasksTable");
      };
      this.onCheckDueTasks = async () => {
        await this.callBoundAction("/Notes_checkDueTasks", "TasksTable");
      };
    },
    onInit: function _onInit() {
      const oViewModel = new JSONModel({
        editMode: false
      });
      const oView = this.getView();
      if (oView) {
        oView.setModel(oViewModel, "view");
      }
      const router = UIComponent.getRouterFor(this);
      router.getRoute("NotesDetail")?.attachPatternMatched(this.onObjectMatched, this);
    },
    onObjectMatched: function _onObjectMatched(event) {
      const sId = event.getParameter("arguments").noteId;
      this.getView()?.bindElement({
        path: "/Notes(ID='" + sId + "')",
        parameters: {
          $expand: "tasks($expand=status)"
        }
      });
    },
    onFilterTasks: function _onFilterTasks(event) {
      const query = event.getParameter("query");
      this.filterTableByQuery("TasksTable", "description", query);
    },
    onEdit: function _onEdit() {
      this.setEditMode(true);
    },
    onCancel: function _onCancel() {
      const oTable = this.byId("TasksTable");
      //  const oModel = this.getView()!.getModel() as ODataModel;

      //  oModel.resetChanges(); // this undoes all unsaved edits
      this.resetChanges();
      oTable.getBinding("items").refresh(true);
      this.setEditMode(false);
    },
    onSave: async function _onSave() {
      const oModel = this.getView()?.getModel();
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
        error: oError => {
          console.error("Save failed:", oError);
        }
      });
      this.setEditMode(false);
    },
    /**
     * Add a new Task row in the Tasks table
     */
    onAddTask: function _onAddTask() {
      const oModel = this.getView()?.getModel();
      const oContext = this.getView().getBindingContext();
      oModel.create(`${oContext.getPath()}/tasks`, {
        description: "",
        duedate: null,
        status: {
          code: "N"
        }
      }, {
        success: () => console.log("Task created"),
        error: err => console.error("Create failed", err)
      });
    },
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
    onStatusChange: function _onStatusChange(oEvent) {
      const oSelect = oEvent.getSource();
      const sStatus = oSelect.getSelectedKey();
      const oItem = oSelect.getParent(); // ColumnListItem
      const oStatus = oItem.getCells().find(c => c.getId().includes("statusObject"));
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
  });
  return Detail;
});
//# sourceMappingURL=Detail-dbg.controller.js.map
