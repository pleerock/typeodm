import {EmbeddedDocument} from "../../../src/annotation/EmbeddedDocument";
import {Field} from "../../../src/annotation/Field";
import {RelationWithOne} from "../../../src/annotation/RelationWithOne";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {ArrayField} from "../../../src/annotation/ArrayField";

@EmbeddedDocument()
export class PostAuthor {

    @IdField()
    id: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

}