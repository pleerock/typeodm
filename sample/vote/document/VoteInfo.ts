import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithOne} from "../../../src/annotation/RelationWithOne";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {ArrayField} from "../../../src/annotation/ArrayField";
import {VoteInfoData} from "./VoteInfoData";
import {Vote} from "./Vote";

@Document()
export class VoteInfo {

    @IdField()
    id: string;

    @Field()
    createdDate: Date;

    @Field()
    updatedDate: Date;

    @Field()
    comment: string;

    @RelationWithOne<VoteInfoData>(type => VoteInfoData, voteInfoData => voteInfoData.info, {
        cascadeInsert: false,
        cascadeRemove: true
    })
    data: VoteInfoData;

    @RelationWithOne<Vote>(type => Vote, vote => vote.information, {
        cascadeInsert: false
    })
    vote: Vote;

   /* @RelationWithOne<QuestionInformation>(type => QuestionInformation, information => information.question, {
        cascadeInsert: false
    })
    information: QuestionInformation;

    @RelationWithMany<QuestionAnswer>(type => QuestionAnswer, questionAnswer => questionAnswer.question)
    answers: QuestionAnswer[] = [];*/

}