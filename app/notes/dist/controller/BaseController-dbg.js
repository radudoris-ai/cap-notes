sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "sap/ui/core/routing/History", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (Controller, UIComponent, History, Filter, FilterOperator) {
  "use strict";

  /**
   * @namespace ui5.notes.controller
   */
  const BaseController = Controller.extend("ui5.notes.controller.BaseController", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this.callBoundAction = async (sActionName, sTableId) => {
        const oView = this.getView();
        if (!oView) return;
        const oModel = oView.getModel();
        const oContext = oView.getBindingContext();
        if (!oContext) return;
        const sId = oContext.getProperty("ID");
        oModel.callFunction(sActionName, {
          method: "POST",
          urlParameters: {
            ID: sId
          },
          success: () => {
            console.log(`Action ${sActionName} executed successfully`);
            if (sTableId) {
              this.byId(sTableId)?.getBinding("items")?.refresh(true);
            }
          },
          error: err => {
            console.error(`Action ${sActionName} failed:`, err);
          }
        });
      };
    },
    /** Get router */getRouter: function _getRouter() {
      return UIComponent.getRouterFor(this);
    },
    /** Navigate back */onNavBack: function _onNavBack() {
      const history = History.getInstance();
      const previousHash = history.getPreviousHash();
      if (previousHash) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo("NotesList", {}, true);
      }
    },
    /** Get view model */getViewModel: function _getViewModel() {
      return this.getView().getModel("view");
    },
    /** Toggle edit mode */setEditMode: function _setEditMode(bEdit) {
      this.getViewModel().setProperty("/editMode", bEdit);
    },
    /** Get default OData model */getODataModel: function _getODataModel() {
      return this.getView().getModel();
    },
    /** Filter a table by a field */filterTableByQuery: function _filterTableByQuery(sTableId, sField, query) {
      const oTable = this.byId(sTableId);
      if (!oTable) return;
      const oBinding = oTable.getBinding("items");
      if (!oBinding) return;
      const aFilters = query ? [new Filter(sField, FilterOperator.Contains, query)] : [];
      oBinding.filter(aFilters);
    },
    /** Reset all pending changes on OData model */resetChanges: function _resetChanges() {
      const oModel = this.getODataModel();
      oModel.resetChanges(undefined, true, true);
    },
    /** Submit OData changes with success/error logging */submitChanges: function _submitChanges() {
      return new Promise((resolve, reject) => {
        const oModel = this.getODataModel();
        console.log("Pending changes:", oModel.getPendingChanges());
        oModel.submitChanges({
          success: () => {
            console.log("Changes saved successfully");
            resolve();
          },
          error: err => {
            console.error("Save failed:", err);
            reject(err);
          }
        });
      });
    },
    /** Bind element with optional expand */bindElement: function _bindElement(sPath, sExpand) {
      this.getView()?.bindElement({
        path: sPath,
        parameters: sExpand ? {
          $expand: sExpand
        } : undefined
      });
    }
  });
  return BaseController;
});
//# sourceMappingURL=BaseController-dbg.js.map
