import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithOne} from "../../../src/annotation/RelationWithOne";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {ArrayField} from "../../../src/annotation/ArrayField";
import {PostTag} from "./PostTag";
import {PostAuthor} from "./PostAuthor";
import {PostCategory} from "./PostCategory";
import {PostDetails} from "./PostDetails";

@Document()
export class Post {

    @IdField(true)
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