import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/Relation";
import {RelationWithMany} from "../../../src/decorator/Relation";
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

    @RelationWithOne(type => QuestionDetails, {
        cascadeInsert: true
    })
    details: QuestionDetails;

}