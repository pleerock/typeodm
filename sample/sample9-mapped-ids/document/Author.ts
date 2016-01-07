import {Post} from "./Post";
import {Document} from "../../../src/decorator/Document";
import {Field, ArrayField, GeneratedIdField} from "../../../src/decorator/Field";
import {RelationWithMany} from "../../../src/decorator/Relation";

@Document('sample9-author')
export class Author {

    @GeneratedIdField()
    id: string;

    @Field()
    name: string;

    @RelationWithMany<Post>('postIds', type => Post, post => post.author, {
        alwaysLeftJoin: true
    })
    posts: Post[] = [];

    @ArrayField(type => 'string')
    postIds: string[];

}