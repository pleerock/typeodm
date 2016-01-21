import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {ObjectID} from "mongodb";

@Document('sample2-post')
export class Post {

    @ObjectIdField()
    id: ObjectID;

    @Field('title_name')
    title: string;

    @Field('text_content')
    text: string;

}