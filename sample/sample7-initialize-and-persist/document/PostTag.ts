import {EmbeddedDocument} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";

@EmbeddedDocument()
export class PostTag {

    @Field()
    name: string;

    @Field()
    description: string;

}