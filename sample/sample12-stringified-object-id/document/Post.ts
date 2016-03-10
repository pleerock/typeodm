import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdStringField} from "../../../src/decorator/Fields";
import {ObjectID} from "mongodb";

@Document("sample12-post")
export class Post {

    @ObjectIdStringField()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

}