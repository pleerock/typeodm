export class RepositoryNotFoundError extends Error {
    name = 'RepositoryNotFoundError';

    constructor(documentClassOrName: string|Function) {
        super();
        this.message = 'No repository for "' + documentClassOrName + '" has been found!';
    }

}