import {FieldTypeInFunction} from "../../metadata-builder/metadata/FieldMetadata";

export class BothJoinTypesUsedException extends Error {

    constructor(whichObject: string, whichProperty: string) {
        super();
        this.message = 'You cannot have both left join and inner join on your relation for field ' + whichProperty + ' in the ' + whichObject;
    }

}