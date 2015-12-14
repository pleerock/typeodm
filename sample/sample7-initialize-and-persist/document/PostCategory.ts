import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {Post} from "./Post";

@Document()
export class PostCategory {

    @IdField(true)
    id: string;

    @Field()
    name: string;

    @RelationWithMany(type => Post)
    posts: Post[] = [];

}