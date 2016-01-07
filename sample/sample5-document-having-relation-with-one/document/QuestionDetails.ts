import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {RelationWithMany} from "../../../src/decorator/Relation";
import {ObjectID} from "mongodb";

@Document('sample5-question-details')
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