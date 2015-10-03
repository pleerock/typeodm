import {DocumentSchema} from "../../schema/DocumentSchema";

/**
 * Represents single inverse side update operation.
 */
export interface InverseSideUpdateOperation {
    documentSchema: DocumentSchema;
    documentId: any;
    inverseSideDocumentId: any;
    inverseSideDocumentSchema: DocumentSchema;
    inverseSideDocumentProperty: string;
}