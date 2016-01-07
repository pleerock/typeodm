import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/Relation";
import {RelationWithMany} from "../../../src/decorator/Relation";
import {VoteDetails} from "./VoteDetails";
import {ObjectID} from "mongodb";

@Document('sample5-vote')
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