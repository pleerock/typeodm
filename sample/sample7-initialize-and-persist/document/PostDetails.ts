import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {ObjectID} from "mongodb";

@Document('sample7-post-details')
export class PostDetails {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    searchKeywords: string;

    @Field()
    searchDescription: string;

}