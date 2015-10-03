export class ConnectionNotFoundException extends Error {

    constructor(name: string) {
        super();
        this.message = 'No connection "' + name + '" found.';
    }

}