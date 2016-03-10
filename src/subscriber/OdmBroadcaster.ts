import {OdmSubscriber} from "./OdmSubscriber";
import {UpdateEvent} from "./event/UpdateEvent";
import {RemoveEvent} from "./event/RemoveEvent";
import {InsertEvent} from "./event/InsertEvent";

/**
 * Broadcaster provides a helper methods to broadcast events to the subscribers.
 */
export class OdmBroadcaster<Document> {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private subscribers: OdmSubscriber<Document|any>[];
    private _documentClass: Function;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(subscribers: OdmSubscriber<Document|any>[], documentClass: Function) {
        this.subscribers = subscribers;
        this._documentClass = documentClass;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get documentClass(): Function {
        return this._documentClass;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    broadcastBeforeInsert(event: InsertEvent<Document>) {
        this.subscribers
            .filter(subscriber => this.isAllowedSubscribers(subscriber))
            .filter(subscriber => !!subscriber.beforeInsert)
            .forEach(subscriber => subscriber.beforeInsert(event));
    }

    broadcastAfterInsert(event: InsertEvent<Document>) {
        this.subscribers
            .filter(subscriber => this.isAllowedSubscribers(subscriber))
            .filter(subscriber => !!subscriber.afterInsert)
            .forEach(subscriber => subscriber.afterInsert(event));
    }

    broadcastBeforeUpdate(event: UpdateEvent<Document>) {
        this.subscribers
            .filter(subscriber => this.isAllowedSubscribers(subscriber))
            .filter(subscriber => !!subscriber.beforeUpdate)
            .forEach(subscriber => subscriber.beforeUpdate(event));
    }

    broadcastAfterUpdate(event: UpdateEvent<Document>) {
        this.subscribers
            .filter(subscriber => this.isAllowedSubscribers(subscriber))
            .filter(subscriber => !!subscriber.afterUpdate)
            .forEach(subscriber => subscriber.afterUpdate(event));
    }

    broadcastAfterRemove(event: RemoveEvent<Document>) {
        this.subscribers
            .filter(subscriber => this.isAllowedSubscribers(subscriber))
            .filter(subscriber => !!subscriber.afterRemove)
            .forEach(subscriber => subscriber.afterRemove(event));
    }

    broadcastBeforeRemove(event: RemoveEvent<Document>) {
        this.subscribers
            .filter(subscriber => this.isAllowedSubscribers(subscriber))
            .filter(subscriber => !!subscriber.beforeRemove)
            .forEach(subscriber => subscriber.beforeRemove(event));
    }

    broadcastAfterLoadedAll(documents: Document[]) {
        if (!documents || documents.length) return;

        this.subscribers
            .filter(subscriber => this.isAllowedSubscribers(subscriber))
            .filter(subscriber => !!subscriber.afterLoad)
            .forEach(subscriber => {
                documents.forEach(document => subscriber.afterLoad(document));
            });
    }

    broadcastAfterLoaded(document: Document) {
        if (!document) return;

        this.subscribers
            .filter(subscriber => this.isAllowedSubscribers(subscriber))
            .filter(subscriber => !!subscriber.afterLoad)
            .forEach(subscriber => subscriber.afterLoad(document));
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private isAllowedSubscribers(subscriber: OdmSubscriber<Document|any>) {
        return !subscriber.listenTo() || subscriber.listenTo() === Object || subscriber.listenTo() === this._documentClass;
    }

}