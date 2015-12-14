import {EmbeddedDocument} from "../../../src/decorator/EmbeddedDocument";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";

@EmbeddedDocument()
export class PostTag {

    @Field()
    name: string;

    @Field()
    description: string;

}