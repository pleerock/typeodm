import {UpdateEvent} from "./event/UpdateEvent";
import {RemoveEvent} from "./event/RemoveEvent";
import {InsertEvent} from "./event/InsertEvent";

/**
 * Classes that implement this interface are subscribers that subscribe for the specific events of the ODM.
 */
export interface OdmSubscriber<Document> {

    /**
     * Returns the class of the document to which events will listen.
     */
    listenTo(): Function;

    /**
     * Called after document is loaded.
     */
    afterLoad?(document: Document): void;

    /**
     * Called before document is inserted.
     */
    beforeInsert?(event: InsertEvent<Document>): void;

    /**
     * Called after document is inserted.
     */
    afterInsert?(event: InsertEvent<Document>): void;

    /**
     * Called before document is updated.
     */
    beforeUpdate?(event: UpdateEvent<Document>): void;

    /**
     * Called after document is updated.
     */
    afterUpdate?(event: UpdateEvent<Document>): void;

    /**
     * Called before document is replaced.
     */
    beforeRemove?(event: RemoveEvent<Document>): void;

    /**
     * Called after document is removed.
     */
    afterRemove?(event: RemoveEvent<Document>): void;

}