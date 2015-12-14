import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {PostTag} from "./PostTag";
import {PostAuthor} from "./PostAuthor";
import {PostCategory} from "./PostCategory";
import {PostDetails} from "./PostDetails";

@Document()
export class Post {

    @ObjectIdField()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @Field(type => PostAuthor)
    author: PostAuthor;

    @ArrayField(type => PostTag)
    tags: PostTag[] = [];

    @RelationWithOne<PostDetails>(type => PostDetails, null, { cascadeInsert: true, cascadeRemove: true })
    details: PostDetails;

    @RelationWithMany<PostCategory>(type => PostCategory, postCategory => postCategory.posts, { cascadeInsert: true })
    categories: PostCategory[] = [];

    getTitleLowerCased() {
        return this.title.toLowerCase();
    }

}