import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";
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