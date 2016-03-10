import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithOne} from "../../../src/decorator/Relations";
import {RelationWithMany} from "../../../src/decorator/Relations";
import {VoteDetails} from "./VoteDetails";
import {ObjectID} from "mongodb";

@Document("sample5-vote")
export class Vote {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => VoteDetails, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    details: VoteDetails;

}