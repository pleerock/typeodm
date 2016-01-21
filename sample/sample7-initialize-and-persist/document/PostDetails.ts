import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
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