import {FieldMetadata} from "./metadata/FieldMetadata";
import {DocumentMetadata} from "./metadata/DocumentMetadata";
import {OdmEventSubscriberMetadata} from "./metadata/OdmEventSubscriberMetadata";
import {AbstractDocumentMetadata} from "./metadata/AbstractDocumentMetadata";
import {MetadataAlreadyExistsError} from "./error/MetadataAlreadyExistsError";
import {MetadataWithSuchNameAlreadyExistsError} from "./error/MetadataWithSuchNameAlreadyExistsError";
import {RelationMetadata} from "./metadata/RelationMetadata";
import {IndexMetadata} from "./metadata/IndexMetadata";
import {CompoundIndexMetadata} from "./metadata/CompoundIndexMetadata";

/**
 * Storage all metadatas of all available types: documents, fields, subscribers, relations, etc.
 * Each metadata represents some specifications of what it represents.
 */
export class MetadataStorage {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _documentMetadatas: DocumentMetadata[] = [];
    private _odmEventSubscriberMetadatas: OdmEventSubscriberMetadata[] = [];
    private _fieldMetadatas: FieldMetadata[] = [];
    private _indexMetadatas: IndexMetadata[] = [];
    private _compoundIndexMetadatas: CompoundIndexMetadata[] = [];
    private _abstractDocumentMetadatas: AbstractDocumentMetadata[] = [];
    private _relationWithOneMetadatas: RelationMetadata[] = [];
    private _relationWithManyMetadatas: RelationMetadata[] = [];

    // -------------------------------------------------------------------------
    // Getter Methods
    // -------------------------------------------------------------------------

    get documentMetadatas(): DocumentMetadata[] {
        return this._documentMetadatas;
    }

    get odmEventSubscriberMetadatas(): OdmEventSubscriberMetadata[] {
        return this._odmEventSubscriberMetadatas;
    }

    get fieldMetadatas(): FieldMetadata[] {
        return this._fieldMetadatas;
    }

    get indexMetadatas(): IndexMetadata[] {
        return this._indexMetadatas;
    }

    get compoundIndexMetadatas(): CompoundIndexMetadata[] {
        return this._compoundIndexMetadatas;
    }

    get abstractDocumentMetadatas(): AbstractDocumentMetadata[] {
        return this._abstractDocumentMetadatas;
    }

    get relationWithOneMetadatas(): RelationMetadata[] {
        return this._relationWithOneMetadatas;
    }

    get relationWithManyMetadatas(): RelationMetadata[] {
        return this._relationWithManyMetadatas;
    }

    // -------------------------------------------------------------------------
    // Adder Methods
    // -------------------------------------------------------------------------

    addDocumentMetadata(metadata: DocumentMetadata) {
        if (this.hasDocumentMetadataWithObjectConstructor(metadata.objectConstructor))
            throw new MetadataAlreadyExistsError("Document", metadata.objectConstructor);

        if (metadata.name && this.hasDocumentMetadataWithName(metadata.name))
            throw new MetadataWithSuchNameAlreadyExistsError("Document", metadata.name);

        this.documentMetadatas.push(metadata);
    }

    addAbstractDocumentMetadata(metadata: AbstractDocumentMetadata) {
        if (this.hasAbstractDocumentMetadataWithObjectConstructor(metadata.objectConstructor))
            throw new MetadataAlreadyExistsError("AbstractDocument", metadata.objectConstructor);

        this.abstractDocumentMetadatas.push(metadata);
    }

    addOdmEventSubscriberMetadata(metadata: OdmEventSubscriberMetadata) {
        if (this.hasOdmEventSubscriberWithObjectConstructor(metadata.objectConstructor))
            throw new MetadataAlreadyExistsError("OdmEventSubscriber", metadata.objectConstructor);

        this.odmEventSubscriberMetadatas.push(metadata);
    }

    addFieldMetadata(metadata: FieldMetadata) {
        if (this.hasFieldMetadataOnProperty(metadata.object.constructor, metadata.propertyName))
            throw new MetadataAlreadyExistsError("Field", metadata.object.constructor);

        if (metadata.name && this.hasFieldMetadataWithName(metadata.object.constructor, metadata.name))
            throw new MetadataWithSuchNameAlreadyExistsError("Field", metadata.name);

        this.fieldMetadatas.push(metadata);
    }

    addRelationWithOneMetadata(metadata: RelationMetadata) {
        if (this.hasRelationWithOneMetadataOnProperty(metadata.object.constructor, metadata.propertyName))
            throw new MetadataAlreadyExistsError("RelationWithOne", metadata.object.constructor, metadata.propertyName);

        if (metadata.name && this.hasRelationWithOneMetadataWithName(metadata.object.constructor, metadata.name))
            throw new MetadataWithSuchNameAlreadyExistsError("RelationWithOne", metadata.name);

        this.relationWithOneMetadatas.push(metadata);
    }

    addRelationWithManyMetadata(metadata: RelationMetadata) {
        if (this.hasRelationWithManyMetadataOnProperty(metadata.object.constructor, metadata.propertyName))
            throw new MetadataAlreadyExistsError("RelationWithMany", metadata.object.constructor, metadata.propertyName);

        if (metadata.name && this.hasRelationWithManyMetadataWithName(metadata.object.constructor, metadata.name))
            throw new MetadataWithSuchNameAlreadyExistsError("RelationWithMany", metadata.name);

        this.relationWithManyMetadatas.push(metadata);
    }

    addIndexMetadata(metadata: IndexMetadata) {
        if (this.hasFieldMetadataOnProperty(metadata.object.constructor, metadata.propertyName))
            throw new MetadataAlreadyExistsError("Index", metadata.object.constructor);

        if (metadata.name && this.hasFieldMetadataWithName(metadata.object.constructor, metadata.name))
            throw new MetadataWithSuchNameAlreadyExistsError("Index", metadata.name);

        this.indexMetadatas.push(metadata);
    }

    addCompoundIndexMetadata(metadata: CompoundIndexMetadata) {
        if (this.hasCompoundIndexMetadataWithObjectConstructor(metadata.objectConstructor))
            throw new MetadataAlreadyExistsError("CompoundIndex", metadata.objectConstructor);

        if (metadata.name && this.hasCompoundIndexMetadataWithName(metadata.name))
            throw new MetadataWithSuchNameAlreadyExistsError("CompoundIndex", metadata.name);

        this.compoundIndexMetadatas.push(metadata);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    findDocumentMetadatasForClasses(classes: Function[]): DocumentMetadata[] {
        return this.documentMetadatas.filter(metadata => classes.indexOf(metadata.objectConstructor) !== -1);
    }

    findCompoundIndexMetadatasForClasses(classes: Function[]): CompoundIndexMetadata[] {
        return this.compoundIndexMetadatas.filter(metadata => classes.indexOf(metadata.objectConstructor) !== -1);
    }

    findAbstractDocumentMetadatasForClasses(classes: Function[]): AbstractDocumentMetadata[] {
        return this.abstractDocumentMetadatas.filter(metadata => classes.indexOf(metadata.objectConstructor) !== -1);
    }

    findIndexMetadatasForClasses(classes: Function[]): IndexMetadata[] {
        return this.indexMetadatas.filter(metadata => classes.indexOf(metadata.object.constructor) !== -1);
    }

    findFieldMetadatasForClasses(classes: Function[]): FieldMetadata[] {
        return this.fieldMetadatas.filter(metadata => classes.indexOf(metadata.object.constructor) !== -1);
    }

    findRelationWithOneMetadatasForClasses(classes: Function[]): RelationMetadata[] {
        return this.relationWithOneMetadatas.filter(metadata => classes.indexOf(metadata.object.constructor) !== -1);
    }

    findRelationWithManyMetadatasForClasses(classes: Function[]): RelationMetadata[] {
        return this.relationWithManyMetadatas.filter(metadata => classes.indexOf(metadata.object.constructor) !== -1);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private hasDocumentMetadataWithObjectConstructor(constructor: Function): boolean {
        return this.documentMetadatas.reduce((found, metadata) => metadata.objectConstructor === constructor ? metadata : found, null) !== null;
    }

    private hasCompoundIndexMetadataWithObjectConstructor(constructor: Function): boolean {
        return this.compoundIndexMetadatas.reduce((found, metadata) => metadata.objectConstructor === constructor ? metadata : found, null) !== null;
    }

    private hasAbstractDocumentMetadataWithObjectConstructor(constructor: Function): boolean {
        return this.abstractDocumentMetadatas.reduce((found, metadata) => metadata.objectConstructor === constructor ? metadata : found, null) !== null;
    }

    private hasOdmEventSubscriberWithObjectConstructor(constructor: Function): boolean {
        return this.odmEventSubscriberMetadatas.reduce((found, metadata) => metadata.objectConstructor === constructor ? metadata : found, null) !== null;
    }

    private hasFieldMetadataOnProperty(constructor: Function, propertyName: string): boolean {
        return this.fieldMetadatas.reduce((found, metadata) => {
            return metadata.object.constructor === constructor && metadata.propertyName === propertyName ? metadata : found;
        }, null) !== null;
    }

    private hasRelationWithOneMetadataOnProperty(constructor: Function, propertyName: string): boolean {
        return this.relationWithOneMetadatas.reduce((found, metadata) => {
                return metadata.object.constructor === constructor && metadata.propertyName === propertyName ? metadata : found;
            }, null) !== null;
    }

    private hasRelationWithManyMetadataOnProperty(constructor: Function, propertyName: string): boolean {
        return this.relationWithManyMetadatas.reduce((found, metadata) => {
                return metadata.object.constructor === constructor && metadata.propertyName === propertyName ? metadata : found;
            }, null) !== null;
    }

    private hasDocumentMetadataWithName(name: string): boolean {
        return this.documentMetadatas.reduce((found, metadata) => metadata.name === name ? metadata : found, null) !== null;
    }

    private hasCompoundIndexMetadataWithName(name: string): boolean {
        return this.compoundIndexMetadatas.reduce((found, metadata) => metadata.name === name ? metadata : found, null) !== null;
    }

    private hasFieldMetadataWithName(constructor: Function, name: string): boolean {
        return this.fieldMetadatas.reduce((found, metadata) => {
            return metadata.object.constructor === constructor && metadata.name === name ? metadata : found;
        }, null) !== null;
    }

    private hasRelationWithOneMetadataWithName(constructor: Function, name: string): boolean {
        return this.relationWithOneMetadatas.reduce((found, metadata) => {
                return metadata.object.constructor === constructor && metadata.name === name ? metadata : found;
            }, null) !== null;
    }

    private hasRelationWithManyMetadataWithName(constructor: Function, name: string): boolean {
        return this.relationWithManyMetadatas.reduce((found, metadata) => {
            return metadata.object.constructor === constructor && metadata.name === name ? metadata : found;
        }, null) !== null;
    }

}

/**
 * Default metadata storage used as singleton and can be used to storage all metadatas in the system.
 */
export let defaultMetadataStorage = new MetadataStorage();