import {Document} from "../../../src/decorator/Document";
import {Field, IdField} from "../../../src/decorator/Field";
import {ObjectID} from "mongodb";

@Document('sample8-post')
export class Post {

    @IdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

}