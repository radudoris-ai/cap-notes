import cds from '@sap/cds';

class NotesService extends cds.ApplicationService {
    init() {

         const { Notes, Tasks } = this.entities;

        this.on('deleteAllTasks', Notes, async (req: cds.Request) => {

            const NoteID = req.params[0].ID;
       //     console.log('<<<<<<<<<<<<<<<<<here am i>>>', NoteID);   
            await DELETE.from(Tasks).where({note_ID: NoteID}) ;
        })

        return super.init();
    }

}

// Register the service implementation
module.exports = { NotesService };