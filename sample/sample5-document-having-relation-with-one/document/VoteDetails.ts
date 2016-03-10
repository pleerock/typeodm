import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithOne} from "../../../src/decorator/Relations";
import {RelationWithMany} from "../../../src/decorator/Relations";
import {Vote} from "./Vote";
import {ObjectID} from "mongodb";

@Document("sample5-vote-details")
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