using NotesService as service from '../../srv/service';
using from '../../db/schema';

annotate service.Notes with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : title,
                Label : '{i18n>Title}',
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Description}',
                Value : description,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Tasks}',
            ID : 'i18nTasks',
            Target : 'tasks/@UI.LineItem#i18nTasks',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : title,
        },
        {
            $Type : 'UI.DataField',
            Label : 'description',
            Value : description,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'NotesService.deleteAllTasks',
            Label : 'Delete all Tasks',
        },
    ],
    UI.SelectionFields : [
        
    ],
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : title,
        },
        TypeName : '',
        TypeNamePlural : '',
        Description : {
            $Type : 'UI.DataField',
            Value : description,
        },
    },
    UI.Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'NotesService.deleteAllTasks',
            Label : 'Delete all Tasks',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'NotesService.checkDueTasks',
            Label : 'checkDueTasks',
        },
    ],
    
);

annotate service.Tasks with {
    status @(
        Common.Label : '{i18n>Status}',
        Common.ValueListWithFixedValues : true,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Status',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_code,
                    ValueListProperty : 'code',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'descr',
                },
            ],
        },
        Common.Text : status.descr,
    )
};

annotate service.Status with {
    code @(
        Common.Text : descr,
        Common.Text.@UI.TextArrangement : #TextFirst,
    )
};

annotate service.Tasks with @(
    UI.LineItem #i18nTasks : [
        {
            $Type : 'UI.DataField',
            Value : description,
            Label : 'Description',
        },
        {
            $Type : 'UI.DataField',
            Value : status_code,
            Criticality : criticality,
        },
        {
            $Type : 'UI.DataField',
            Value : duedate,
            Label : 'duedate',
        },
        {
            $Type : 'UI.DataField',
            Value : remindersent,
            Label : 'remindersent',
        },
        {
            $Type : 'UI.DataField',
            Value : assignedto,
            Label : 'assignedto',
        },
    ]
);

