using {do.capire.Notes as my} from '../db/schema';

/**
 * Service to manage Notes and Tasks by Users.
 */
service NotesService {
   entity Notes as projection on my.Notes actions{
      @(Common.SideEffects: {TargetEntities: ['in']})
      action deleteAllTasks();
   }

   entity Tasks as projection on my.Tasks;
}

annotate NotesService.Notes with @odata.draft.enabled;
