import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {IdField} from "../../../src/annotation/IdField";

@Document()
export class PostDetails {

    @IdField(true)
    id: string;

    @Field()
    searchKeywords: string;

    @Field()
    searchDescription: string;

}