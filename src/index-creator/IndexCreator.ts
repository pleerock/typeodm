import {NamingStrategy} from "../naming-strategy/NamingStrategy";
import {MetadataAggregation} from "../metadata-builder/MetadataAggregation";
import {DocumentMetadata} from "../metadata-builder/metadata/DocumentMetadata";
import {Connection} from "../connection/Connection";
import {FieldSchema} from "../schema/FieldSchema";

/**
 * Creates indexes based on the given metadata
 */
export class IndexCreator {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private connection: Connection;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(connection: Connection) {
        this.connection = connection;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Creates indexies for all schemas in the current connection.
     */
    create(): Promise<void> {
        return Promise.all(this.connection.schemas.map(schema => {

            let compoundIndexiesCreation = schema.compoundIndexies.map(compoundIndex => {
                return this.connection.driver.createIndex(schema.name, compoundIndex.fields, {
                    unique: compoundIndex.unique,
                    name: compoundIndex.name,
                    sparse: compoundIndex.sparse,
                    expireAfterSeconds: compoundIndex.ttl
                });
            });

            let fieldIndexiesCreation = schema.fields.filter(field => !!field.index).map((field: FieldSchema) => {
                let index = field.index;
                let key = { [field.name]: index.hashed ? "hashed" : index.descendingSort ? -1 : 1 };
                return this.connection.driver.createIndex(schema.name, key, {
                    unique: index.unique,
                    name: index.name,
                    sparse: index.sparse,
                    expireAfterSeconds: index.ttl
                });
            });

            return Promise.all([compoundIndexiesCreation, fieldIndexiesCreation]);

        })).then(function() {});
    }

}