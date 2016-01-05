import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";

@Document('sample7-post-details')
export class PostDetails {

    @ObjectIdField()
    id: string;

    @Field()
    searchKeywords: string;

    @Field()
    searchDescription: string;

}