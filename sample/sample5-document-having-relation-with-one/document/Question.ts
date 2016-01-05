import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";
import {QuestionDetails} from "./QuestionDetails";
import {ObjectID} from "mongodb";

@Document('sample5-question')
export class Question {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => QuestionDetails, null, {
        cascadeInsert: true
    })
    details: QuestionDetails;

}