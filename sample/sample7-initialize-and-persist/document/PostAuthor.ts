import {EmbeddedDocument} from "../../../src/decorator/EmbeddedDocument";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";
import {ArrayField} from "../../../src/decorator/ArrayField";

@EmbeddedDocument()
export class PostAuthor {

    @ObjectIdField()
    id: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

}