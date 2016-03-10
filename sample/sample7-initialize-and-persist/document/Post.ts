import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField, ArrayField} from "../../../src/decorator/Fields";
import {RelationWithOne} from "../../../src/decorator/Relations";
import {RelationWithMany} from "../../../src/decorator/Relations";
import {PostTag} from "./PostTag";
import {PostAuthor} from "./PostAuthor";
import {PostCategory} from "./PostCategory";
import {PostDetails} from "./PostDetails";
import {ObjectID} from "mongodb";

@Document("sample7-post")
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

    @RelationWithOne<PostDetails>(type => PostDetails, { cascadeInsert: true, cascadeRemove: true })
    details: PostDetails;

    @RelationWithMany<PostCategory>(type => PostCategory, postCategory => postCategory.posts, { cascadeInsert: true })
    categories: PostCategory[] = [];

    getTitleLowerCased() {
        return this.title.toLowerCase();
    }

}