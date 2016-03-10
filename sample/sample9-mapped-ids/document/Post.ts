import {Author} from "./Author";
import {Document} from "../../../src/decorator/Documents";
import {Field, GeneratedIdField} from "../../../src/decorator/Fields";
import {RelationWithOne} from "../../../src/decorator/Relations";

@Document("sample9-post")
export class Post {

    @GeneratedIdField()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne<Author>("authorId", type => Author, author => author.posts, {
        cascadeInsert: true
    })
    author: Author;

    @Field()
    authorId: string;

}