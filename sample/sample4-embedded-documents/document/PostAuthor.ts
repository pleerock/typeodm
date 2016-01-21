import {EmbeddedDocument} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {ObjectID} from "mongodb";

@EmbeddedDocument()
export class PostAuthor {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

}