import {DocumentMetadata} from "./metadata/DocumentMetadata";
import {AbstractDocumentMetadata} from "./metadata/AbstractDocumentMetadata";
import {MetadataStorage} from "./MetadataStorage";
import {ObjectPropertyMetadata} from "./metadata/ObjectPropertyMetadata";
import {MetadataAggregation} from "./MetadataAggregation";

/**
 * Aggregates all metadata: document, field, relation into one collection grouped by documents for a given set of classes.
 */
export class MetadataAggregationBuilder {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private metadataStorage: MetadataStorage;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(metadataStorage: MetadataStorage) {
        this.metadataStorage = metadataStorage;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Builds a complete metadata aggregations for the given document classes.
     */
    build(documentClasses: Function[]): MetadataAggregation[] {

        // filter the metadata only we need - those which are bind to the given document classes
        let documentMetadatas = this.metadataStorage.findDocumentMetadatasForClasses(documentClasses);
        let abstractDocumentMetadatas = this.metadataStorage.findAbstractDocumentMetadatasForClasses(documentClasses);
        let fieldMetadatas = this.metadataStorage.findFieldMetadatasForClasses(documentClasses);
        let relationWithOneMetadatas = this.metadataStorage.findRelationWithOneMetadatasForClasses(documentClasses);
        let relationWithManyMetadatas = this.metadataStorage.findRelationWithManyMetadatasForClasses(documentClasses);
        let compoundIndexMetadatas = this.metadataStorage.findCompoundIndexMetadatasForClasses(documentClasses);
        let documentIndexMetadatas = this.metadataStorage.findIndexMetadatasForClasses(documentClasses);

        return documentMetadatas.map(documentMetadata => {
            let constructorChecker = (opm: ObjectPropertyMetadata) => opm.object.constructor === documentMetadata.objectConstructor;
            let constructorChecker2 = (opm: { objectConstructor: Function }) => opm.objectConstructor === documentMetadata.objectConstructor;

            let documentFields = fieldMetadatas.filter(constructorChecker);
            let documentRelationWithOnes = relationWithOneMetadatas.filter(constructorChecker);
            let documentRelationWithManies = relationWithManyMetadatas.filter(constructorChecker);
            let documentCompoundIndexies = compoundIndexMetadatas.filter(constructorChecker2);
            let documentIndexies = documentIndexMetadatas.filter(constructorChecker);

            // merge all fields in the abstract document extendings of this document
            abstractDocumentMetadatas.forEach(abstractMetadata => {
                if (!this.isDocumentMetadataExtendsAbstractMetadata(documentMetadata, abstractMetadata)) return;
                let constructorChecker = (opm: ObjectPropertyMetadata) => opm.object.constructor === abstractMetadata.objectConstructor;
                let constructorChecker2 = (opm: { objectConstructor: Function }) => opm.objectConstructor === abstractMetadata.objectConstructor;

                let abstractFields = fieldMetadatas.filter(constructorChecker);
                let abstractRelationWithOnes = documentRelationWithOnes.filter(constructorChecker);
                let abstractRelationWithManies = documentRelationWithManies.filter(constructorChecker);
                let abstractCompoundIndexies = documentCompoundIndexies.filter(constructorChecker2);
                let abstractIndexies = documentIndexMetadatas.filter(constructorChecker);

                let inheritedFields = this.filterObjectPropertyMetadatasIfNotExist(abstractFields, documentFields);
                let inheritedRelationWithOnes = this.filterObjectPropertyMetadatasIfNotExist(abstractRelationWithOnes, documentRelationWithOnes);
                let inheritedRelationWithManies = this.filterObjectPropertyMetadatasIfNotExist(abstractRelationWithManies, documentRelationWithManies);
                let inheritedIndexies = this.filterObjectPropertyMetadatasIfNotExist(abstractIndexies, documentIndexies);

                documentCompoundIndexies = documentCompoundIndexies.concat(abstractCompoundIndexies);
                documentFields = documentFields.concat(inheritedFields);
                documentRelationWithOnes = documentRelationWithOnes.concat(inheritedRelationWithOnes);
                documentRelationWithManies = documentRelationWithManies.concat(inheritedRelationWithManies);
                documentIndexies = documentIndexies.concat(inheritedIndexies);
            });

            return <MetadataAggregation> {
                documentMetadata: documentMetadata,
                fieldMetadatas: documentFields,
                indexMetadatas: documentIndexies,
                compoundIndexMetadatas: documentCompoundIndexies,
                relationWithOneMetadatas: documentRelationWithOnes,
                relationWithManyMetadatas: documentRelationWithManies,
            };
        });
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private isDocumentMetadataExtendsAbstractMetadata(documentMetadata: DocumentMetadata,
                                                      abstractMetadata: AbstractDocumentMetadata): boolean {
        return documentMetadata.objectConstructor.prototype instanceof abstractMetadata.objectConstructor;
    }

    private filterObjectPropertyMetadatasIfNotExist<T extends ObjectPropertyMetadata>(newMetadatas: T[], existsMetadatas: T[]): T[] {
        return newMetadatas.filter(fieldFromMapped => {
            return existsMetadatas.reduce((found, fieldFromDocument) => {
                    return fieldFromDocument.propertyName === fieldFromMapped.propertyName ? fieldFromDocument : found;
                }, null) === null;
        });
    }

}