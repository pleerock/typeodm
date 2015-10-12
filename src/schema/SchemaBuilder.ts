import {NamingStrategy} from "../naming-strategy/NamingStrategy";
import {MetadataAggregation} from "../metadata-builder/MetadataAggregation";
import {DocumentSchema} from "./DocumentSchema";
import {DocumentMetadata} from "../metadata-builder/metadata/DocumentMetadata";
import {FieldMetadata, FieldTypeInFunction} from "../metadata-builder/metadata/FieldMetadata";
import {FieldSchema} from "./FieldSchema";
import {RelationMetadata, PropertyTypeInFunction} from "../metadata-builder/metadata/RelationMetadata";
import {RelationSchema} from "./RelationSchema";
import {CompoundIndexMetadata} from "../metadata-builder/metadata/CompoundIndexMetadata";
import {CompoundIndexSchema} from "./CompoundIndexSchema";
import {IndexMetadata} from "../metadata-builder/metadata/IndexMetadata";
import {IndexSchema} from "./IndexSchema";

/**
 * Builds a document schemas with their field and relation schemas from the given document classes.
 */
export class SchemaBuilder {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private namingStrategy: NamingStrategy;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(namingStrategy: NamingStrategy) {
        this.namingStrategy = namingStrategy;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Builds a complete document schemas for the given document classes.
     */
    build(aggregatedMetadata: MetadataAggregation[]): DocumentSchema[] {
        return aggregatedMetadata.map(aggregation => this.createDocumentSchemaFromMetadata(aggregatedMetadata, aggregation));
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private createDocumentSchemaFromMetadata(aggregatedMetadata: MetadataAggregation[], aggregation: MetadataAggregation): DocumentSchema {
        let fieldSchemas = aggregation.fieldMetadatas.map(metadata => this.createFieldSchemaFromMetadata(aggregation.indexMetadatas, metadata));
        let relationWithOnesSchemas = aggregation.relationWithOneMetadatas.map(metadata => this.createRelationSchemaFromMetadata(aggregatedMetadata, metadata));
        let relationWithManySchemas = aggregation.relationWithManyMetadatas.map(metadata => this.createRelationSchemaFromMetadata(aggregatedMetadata, metadata));
        let compoundIndexSchemas = aggregation.compoundIndexMetadatas.map(metadata => this.createCompoundIndexSchemaFromMetadata(metadata));

        return new DocumentSchema(
            this.generateDocumentSchemaName(aggregation.documentMetadata),
            aggregation.documentMetadata.objectConstructor,
            fieldSchemas,
            relationWithOnesSchemas,
            relationWithManySchemas,
            compoundIndexSchemas
        );
    }

    private createFieldSchemaFromMetadata(indexMetadatas: IndexMetadata[], metadata: FieldMetadata): FieldSchema {
        let index = indexMetadatas.reduce((found, indexMetadata) => indexMetadata.propertyName === metadata.propertyName ? indexMetadata : found, null);
        return new FieldSchema(
            metadata.name || this.namingStrategy.fieldName(metadata.propertyName),
            this.convertType(metadata.type),
            metadata.propertyName,
            metadata.isId,
            metadata.isArray,
            metadata.isCreateDate,
            metadata.isUpdateDate,
            index ? this.createIndexSchemaFromMetadata(index) : undefined
        );
    }

    private createIndexSchemaFromMetadata(metadata: IndexMetadata): IndexSchema{
        return new IndexSchema(metadata.name, metadata.unique, metadata.sparse, metadata.descendingSort, metadata.hashed, metadata.ttl);
    }

    private createRelationSchemaFromMetadata(aggregatedMetadata: MetadataAggregation[], metadata: RelationMetadata): RelationSchema {
        let type = metadata.type();
        let relatedDocument = aggregatedMetadata.reduce((found, metadata) => metadata.documentMetadata.objectConstructor === type ? metadata : found, null);
        let documentPropertiesMap = this.createPropertiesMirror(relatedDocument);
        return new RelationSchema(
            metadata.name || this.namingStrategy.fieldName(metadata.propertyName),
            type,
            metadata.propertyName,
            this.computeInverseSide(documentPropertiesMap, metadata.inverseSide),
            metadata.isCascadeInsert,
            metadata.isCascadeUpdate,
            metadata.isCascadeRemove,
            metadata.isAlwaysLeftJoin,
            metadata.isAlwaysInnerJoin
        );
    }

    private createCompoundIndexSchemaFromMetadata(metadata: CompoundIndexMetadata): CompoundIndexSchema {
        return new CompoundIndexSchema(
            metadata.fields,
            metadata.name,
            metadata.unique,
            metadata.sparse,
            metadata.hashed,
            metadata.ttl
        );
    }

    private generateDocumentSchemaName(documentMetadata: DocumentMetadata): string {
        return documentMetadata.name || this.namingStrategy.documentName(documentMetadata.objectConstructor.name);
    }

    private convertType(typeInFunction: FieldTypeInFunction): string|Function {
        // todo: throw exception if no type in type function
        let type: Function|string = typeInFunction();
        if (type instanceof Function) {
            let typeName = (<Function>type).name.toLowerCase();
            switch (typeName) {
                case 'number':
                case 'boolean':
                case 'string':
                    return typeName;
            }
        }
        return type;
    }

    private createPropertiesMirror(relatedDocument: MetadataAggregation): any {
        let document: any = {};
        relatedDocument.fieldMetadatas.forEach(metadata => document[metadata.propertyName] = metadata.propertyName);
        relatedDocument.relationWithOneMetadatas.forEach(metadata => document[metadata.propertyName] = metadata.propertyName);
        relatedDocument.relationWithManyMetadatas.forEach(metadata => document[metadata.propertyName] = metadata.propertyName);
        return document;
    }

    private computeInverseSide(documentPropertiesMap: any, inverseSide: PropertyTypeInFunction<any>): string {
        if (typeof inverseSide === 'function')
            return (<Function> inverseSide)(documentPropertiesMap);
        if (typeof inverseSide === 'string')
            return <string> inverseSide;

        return null;
    }

}