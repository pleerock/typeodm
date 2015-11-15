import {RelationSchema} from "./RelationSchema";
import {FieldSchema} from "./FieldSchema";
import {CompoundIndexSchema} from "./CompoundIndexSchema";

/**
 * Document schema represents a document's structure and all its fields and relations.
 */
export class DocumentSchema {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _name: string;
    private _documentClass: Function;
    private _fields: FieldSchema[];
    private _relationWithOnes: RelationSchema[];
    private _relationWithManies: RelationSchema[];
    private _compoundIndexies: CompoundIndexSchema[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(name: string,
                documentClass: Function,
                fields: FieldSchema[],
                relationWithOnes: RelationSchema[],
                relationWithManies: RelationSchema[],
                compoundIndexies: CompoundIndexSchema[]) {

        this._name = name;
        this._documentClass = documentClass;
        this._fields = fields;
        this._relationWithOnes = relationWithOnes;
        this._relationWithManies = relationWithManies;
        this._compoundIndexies = compoundIndexies;
    }

    // -------------------------------------------------------------------------
    // Getter Methods
    // -------------------------------------------------------------------------

    get name(): string {
        return this._name;
    }

    get documentClass(): Function {
        return this._documentClass;
    }

    get fields(): FieldSchema[] {
        return this._fields;
    }

    get relationWithOnes(): RelationSchema[] {
        return this._relationWithOnes;
    }

    get relationWithManies(): RelationSchema[] {
        return this._relationWithManies;
    }

    get compoundIndexies(): CompoundIndexSchema[] {
        return this._compoundIndexies;
    }

    get idField(): FieldSchema { // todo: note that only embed document can not have id
        return this._fields.reduce((found, field) => field.isId ? field : found, null);
    }

    get createDateField(): FieldSchema {
        return this._fields.reduce((found, field) => field.isCreateDate ? field : found, null);
    }

    get updateDateField(): FieldSchema {
        return this._fields.reduce((found, field) => field.isUpdateDate ? field : found, null);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Creates a new document.
     */
    create(): any {
        if (this.documentClass instanceof Function) {
            let documentConstructor: any = this.documentClass;
            return new documentConstructor();
        } else {
            return {};
        }
    }

    createIdCondition(): any {
        return {  };
    }

    findFieldByPropertyName(propertyName: string): FieldSchema {
        return this.fields.reduce((found, field) => field.propertyName === propertyName ? field : found, null);
    }

    findFieldByDbName(name: string): FieldSchema {
        return this.fields.reduce((found, field) => field.name === name ? field : found, null);
    }

    findRelationWithOneByPropertyName(propertyName: string): RelationSchema {
        return this.relationWithOnes.reduce((found, relation) => relation.propertyName === propertyName ? relation : found, null);
    }

    findRelationWithOneByDbName(name: string): RelationSchema {
        return this.relationWithOnes.reduce((found, relation) => relation.name === name ? relation : found, null);
    }

    findRelationWithManyByPropertyName(propertyName: string): RelationSchema {
        return this.relationWithManies.reduce((found, relation) => relation.propertyName === propertyName ? relation : found, null);
    }

    findRelationWithManyByDbName(name: string): RelationSchema {
        return this.relationWithManies.reduce((found, relation) => relation.name === name ? relation : found, null);
    }

    hasFieldWithPropertyName(propertyName: string): boolean {
        return !!this.findFieldByPropertyName(propertyName);
    }

    isFieldId(propertyName: string): boolean {
        let field = this.findFieldByPropertyName(propertyName);
        return field && field.isId;
    }

    hasRelationWithOneWithPropertyName(propertyName: string): boolean {
        return !!this.findRelationWithOneByPropertyName(propertyName);
    }

    hasRelationWithManyWithPropertyName(propertyName: string): boolean {
        return !!this.findRelationWithManyByPropertyName(propertyName);
    }

    getDocumentId(document: Object|any): any {
        return document[this.idField.name];
    }

    isDocumentTypeCorrect(document: any) {
        return this.documentClass instanceof Function && document instanceof this.documentClass;
    }

    hasFieldOrRelationWithPropertyName(propertyName: string): boolean {
        return this.hasFieldWithPropertyName(propertyName) ||
            this.hasRelationWithOneWithPropertyName(propertyName) ||
            this.hasRelationWithManyWithPropertyName(propertyName);
    }

    getFunctionTypeForFieldOrRelationWithPropertyName(propertyName: string): Function {
        let field = this.findFieldByPropertyName(propertyName);
        if (field && field.type instanceof Function)
            return <Function> field.type;

        let relationWithOne = this.findRelationWithOneByPropertyName(propertyName);
        if (relationWithOne)
            return relationWithOne.type;

        let relationWithMany = this.findRelationWithManyByPropertyName(propertyName);
        if (relationWithMany)
            return relationWithMany.type;
    }

    getIdValue(value: any): any { // todo: implement
        return this.idField.isObjectId && this.idField.isTypePrimitive() ? String(value) : value;
    }

    createPropertiesMirror(): any {
        let document: any = {};
        this.fields.forEach(field => document[field.name] = field.name);
        this.relationWithOnes.forEach(relation => document[relation.name] = relation.name);
        this.relationWithManies.forEach(relation => document[relation.name] = relation.name);
        return document;
    }

}