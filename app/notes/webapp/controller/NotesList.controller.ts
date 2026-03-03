import Controller from "sap/ui/core/mvc/Controller";
import { SearchField$SearchEvent } from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import UIComponent from "sap/ui/core/UIComponent";
import Event from "sap/ui/base/Event";
import ObjectListItem from "sap/m/ObjectListItem";

/**
 * @namespace notes.controller
 */
export default class NotesList extends Controller {

   onFilterNotes(event: SearchField$SearchEvent): void {
        // build filter array
        const filter = [];
        const query = event.getParameter("query");
        if (query) {
            filter.push(new Filter("title", FilterOperator.Contains, query));
        }
        // filter binding
        const list = this.byId("NotesTable");
        const binding = list?.getBinding("items") as ListBinding;
        binding?.filter(filter);
    }

    onPress(event: Event): void {
        const item = event.getSource() as ObjectListItem;

        const router = UIComponent.getRouterFor(this);
        const bindingContext = item.getBindingContext();
        
        if (bindingContext) {
             const sId = bindingContext.getProperty("ID");
            router.navTo("NotesDetail", {
              //  notePath: window.encodeURIComponent(bindingContext.getPath().substring(1))
               noteId: sId
            });
        }
    }
}