import {EmbeddedDocument} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
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