import {Post} from "./Post";
import {Document} from "../../../src/decorator/Document";
import {IdField} from "../../../src/decorator/IdField";
import {Field} from "../../../src/decorator/Field";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {GeneratedIdField} from "../../../src/decorator/GeneratedIdField";

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