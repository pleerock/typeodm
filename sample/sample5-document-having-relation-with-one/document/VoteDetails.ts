import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/Relation";
import {RelationWithMany} from "../../../src/decorator/Relation";
import {Vote} from "./Vote";
import {ObjectID} from "mongodb";

@Document('sample5-vote-details')
export class VoteDetails {

    @ObjectIdField()
    id: ObjectID;

    @RelationWithOne(type => Vote)
    vote: Vote;

    @Field()
    createTime: number;

    @Field()
    updateTime: number;

    @Field()
    searchKeywords: string;

    @Field()
    searchDescription: string;

}