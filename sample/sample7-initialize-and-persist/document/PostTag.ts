import {EmbeddedDocument} from "../../../src/decorator/Documents";
import {Field} from "../../../src/decorator/Fields";

@EmbeddedDocument()
export class PostTag {

    @Field()
    name: string;

    @Field()
    description: string;

}