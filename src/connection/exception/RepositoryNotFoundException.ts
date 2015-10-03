export class RepositoryNotFoundException extends Error {

    constructor(documentClassOrName: string|Function) {
        super();
        this.message = 'No repository for "' + documentClassOrName + '" has been found!';
    }

}