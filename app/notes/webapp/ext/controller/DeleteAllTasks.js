sap.ui.define([
    "sap/m/MessageToast", "sap/m/MessageBox"
], function (MessageToast, MessageBox) {
    'use strict';

    return {
        /**
         * Generated event handler.
         *
         * @param oContext the context of the page on which the event was fired. `undefined` for list report page.
         * @param aSelectedContexts the selected contexts of the table rows.
         */
        deletealltasks: function (oContext, aSelectedContexts) {
            MessageBox.confirm(
                "Are you really really sure?",
                {
                    title: "Delete all tasks",
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: async function (oAction) {
                        //       console.error("<<<<<<<<<<<<<<TEST ERROR LOG", oContext);
                        if (oAction !== MessageBox.Action.OK) {
                            return;
                        }
                        try {
                            await this.editFlow.invokeAction(
                                "deleteAllTasks",
                                {
                                    contexts: oContext
                                }
                            );
                            MessageToast.show("All tasks deleted");
                        } catch (e) {
                            MessageBox.error("Deletion failed");
                        }
                    }.bind(this)
                }
            );
        }
    };
});
