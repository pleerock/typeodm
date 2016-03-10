import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField, ArrayField} from "../../../src/decorator/Fields";
import {PostTag} from "./PostTag";
import {PostAuthor} from "./PostAuthor";
import {ObjectID} from "mongodb";

@Document("sample4-post")
export class Post {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

    @Field(type => PostAuthor)
    author: PostAuthor;

    @ArrayField(type => PostTag)
    tags: PostTag[] = [];

    @ArrayField(type => "string")
    links: string[] = [];

}