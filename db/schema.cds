using {cuid, sap.common.CodeList} from '@sap/cds/common';
namespace do.capire.Notes;

/**
 * Notes created by User.
 */
entity Notes : cuid {
    title       : String;
    description : String;
    tasks : Composition of many Tasks on tasks.note = $self;

}

/**
 * Tasks of a Note
 */
entity Tasks : cuid {
    description : String;
    status      : Association to Status;

    criticality : Integer  =
        case status.code
        when 'D' then 3  // Success (green)
        when 'I' then 2  // Warning (yellow)
        when 'N' then 5  
        else 0
        end;

    note : Association to Notes;
}

entity Status : CodeList {
    key code : String enum {
            new = 'N';
            in_process = 'I';
            done = 'D';
        };
}
