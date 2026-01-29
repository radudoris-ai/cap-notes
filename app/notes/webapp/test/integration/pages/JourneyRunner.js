sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ns/notes/test/integration/pages/NotesList",
	"ns/notes/test/integration/pages/NotesObjectPage"
], function (JourneyRunner, NotesList, NotesObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ns/notes') + '/test/flp.html#app-preview',
        pages: {
			onTheNotesList: NotesList,
			onTheNotesObjectPage: NotesObjectPage
        },
        async: true
    });

    return runner;
});

