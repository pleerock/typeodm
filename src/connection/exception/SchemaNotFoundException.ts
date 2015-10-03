export class SchemaNotFoundException extends Error {

    constructor(documentClassOrName: string|Function) {
        super();
        this.message = 'No schema for "' + documentClassOrName + '" has been found!';
    }

}