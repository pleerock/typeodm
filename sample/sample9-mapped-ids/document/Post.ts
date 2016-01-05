import {Author} from "./Author";
import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";
import {GeneratedIdField} from "../../../src/decorator/GeneratedIdField";

@Document('sample9-post')
export class Post {

    @GeneratedIdField()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne<Author>('authorId', type => Author, author => author.posts, {
        cascadeInsert: true
    })
    author: Author;

    @Field()
    authorId: string;

}