import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {ArrayField} from "../../../src/annotation/ArrayField";
import {Post} from "./Post";

@Document()
export class PostCategory {

    @IdField()
    id: string;

    @Field()
    name: string;

    @RelationWithMany(type => Post)
    posts: Post[] = [];

}