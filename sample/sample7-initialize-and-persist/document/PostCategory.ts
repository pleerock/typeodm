import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithMany} from "../../../src/decorator/Relations";
import {Post} from "./Post";
import {ObjectID} from "mongodb";

@Document('sample7-post-category')
export class PostCategory {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    name: string;

    @RelationWithMany(type => Post)
    posts: Post[] = [];

}