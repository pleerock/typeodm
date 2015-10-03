export class FieldTypeNotSupportedException extends Error {
    name = 'FieldTypeNotSupportedException';

    constructor(fieldType: string|Function, field: string, document: any) {
        super();
        this.message = fieldType + ' is not supported set on the field ' + field + ' on the document ' + document;
    }

}