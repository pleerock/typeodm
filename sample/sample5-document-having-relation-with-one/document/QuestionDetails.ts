import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithMany} from "../../../src/decorator/Relations";
import {ObjectID} from "mongodb";

@Document("sample5-question-details")
export class QuestionDetails {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    createTime: number;

    @Field()
    updateTime: number;

    @Field()
    searchKeywords: string;

    @Field()
    searchDescription: string;

}