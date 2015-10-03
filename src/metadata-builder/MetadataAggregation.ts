import {DocumentMetadata} from "./metadata/DocumentMetadata";
import {FieldMetadata} from "./metadata/FieldMetadata";
import {RelationMetadata} from "./metadata/RelationMetadata";
import {CompoundIndexMetadata} from "./metadata/CompoundIndexMetadata";
import {IndexMetadata} from "./metadata/IndexMetadata";

/**
 * Aggregation of all metadata of specific document.
 */
export interface MetadataAggregation {
    documentMetadata: DocumentMetadata;
    fieldMetadatas: FieldMetadata[];
    indexMetadatas: IndexMetadata[];
    compoundIndexMetadatas: CompoundIndexMetadata[];
    relationWithOneMetadatas: RelationMetadata[];
    relationWithManyMetadatas: RelationMetadata[];
}
