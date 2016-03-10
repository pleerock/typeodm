import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithOne} from "../../../src/decorator/Relations";
import {PostDetails} from "./PostDetails";
import {ObjectID} from "mongodb";

@Document("sample5-post")
export class Post {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => PostDetails)
    details: PostDetails;

}