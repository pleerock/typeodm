export class BroadcasterNotFoundException extends Error {

    constructor(documentClassOrName: string|Function) {
        super();
        this.message = 'No broadcaster for "' + documentClassOrName + '" has been found!';
    }

}