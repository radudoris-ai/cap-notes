using {do.capire.Notes as my} from '../db/schema';

/**
 * Service to manage Notes and Tasks by Users.
 */
service NotesService {
   @odata.draft.enabled
   @requires: 'support'
   entity Notes as projection on my.Notes 
   actions{
      @(requires: 'admin')
      @(Common.SideEffects: {TargetEntities: ['in']})
      action deleteAllTasks();

      action checkDueTasks();
   }

   entity Tasks as projection on my.Tasks;
}