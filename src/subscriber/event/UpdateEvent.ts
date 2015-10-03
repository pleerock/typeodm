/**
 * This event is used on update events.
 */
export interface UpdateEvent<Document> {

    document?: Document;
    options?: any;
    conditions?: any;

}