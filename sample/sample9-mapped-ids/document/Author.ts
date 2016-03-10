import {Post} from "./Post";
import {Document} from "../../../src/decorator/Documents";
import {Field, ArrayField, GeneratedIdField} from "../../../src/decorator/Fields";
import {RelationWithMany} from "../../../src/decorator/Relations";

@Document("sample9-author")
export class Author {

    @GeneratedIdField()
    id: string;

    @Field()
    name: string;

    @RelationWithMany<Post>("postIds", type => Post, post => post.author, {
        alwaysLeftJoin: true
    })
    posts: Post[] = [];

    @ArrayField(type => "string")
    postIds: string[];

}