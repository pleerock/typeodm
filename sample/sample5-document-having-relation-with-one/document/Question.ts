import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithOne} from "../../../src/decorator/Relations";
import {RelationWithMany} from "../../../src/decorator/Relations";
import {QuestionDetails} from "./QuestionDetails";
import {ObjectID} from "mongodb";

@Document("sample5-question")
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