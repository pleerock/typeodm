import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {QuestionDetails} from "./QuestionDetails";

@Document()
export class Question {

    @IdField(true)
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => QuestionDetails, null, {
        cascadeInsert: true
    })
    details: QuestionDetails;

}