import {Document} from "../../../src/decorator/Documents";
import {Field, IdField} from "../../../src/decorator/Fields";
import {ObjectID} from "mongodb";

@Document("sample8-post")
export class Post {

    @IdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

}