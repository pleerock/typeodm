import {FieldTypeInFunction} from "../../metadata-builder/metadata/FieldMetadata";

export class WrongFieldTypeError extends Error {
    name = "WrongFieldTypeError";

    constructor(usedTypeFunction: FieldTypeInFunction, whichObject: string, whichProperty: string) {
        super();
        if (!usedTypeFunction || !(typeof usedTypeFunction === "function")) {
            this.message = "Type is not provided or empty for field " + whichProperty + " in the " + whichObject;
        } else {
            this.message = "Given type " + usedTypeFunction() + " for field " + whichProperty + " in the " + whichObject + " is not supported";
        }
    }

}