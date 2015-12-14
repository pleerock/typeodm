import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {IdField} from "../../../src/decorator/IdField";

@Document()
export class PostDetails {

    @IdField(true)
    id: string;

    @Field()
    searchKeywords: string;

    @Field()
    searchDescription: string;

}