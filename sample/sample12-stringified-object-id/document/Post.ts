import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdStringField} from "../../../src/decorator/Field";
import {ObjectID} from "mongodb";

@Document('sample12-post')
export class Post {

    @ObjectIdStringField()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

}