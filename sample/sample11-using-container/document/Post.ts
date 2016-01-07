import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {ObjectID} from "mongodb";

@Document('sample11-post')
export class Post {

    @ObjectIdField()
    id: ObjectID;

    @Field('title_name')
    title: string;

    @Field('text_content')
    text: string;

}