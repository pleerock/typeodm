/**
 * This event is used on remove events.
 */
export interface RemoveEvent<Document> {

    document?: Document;
    conditions?: any;
    documentId?: string;

}