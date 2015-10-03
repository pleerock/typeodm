import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithOne} from "../../../src/annotation/RelationWithOne";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {ArrayField} from "../../../src/annotation/ArrayField";
import {VoteInfo} from "./VoteInfo";
import {Vote} from "./Vote";

@Document()
export class VoteInfoData {

    @IdField()
    id: string;

    @Field()
    content: string;

    @RelationWithOne<VoteInfo>(type => VoteInfo, voteInfo => voteInfo.data, {
        cascadeInsert: true
    })
    info: VoteInfo;

    @RelationWithOne<Vote>(type => Vote, vote => vote.voteInfoData)
    vote: Vote;

    /*@RelationWithMany<QuestionAnswer>(type => QuestionAnswer, questionAnswer => questionAnswer.question)
    answers: QuestionAnswer[] = [];*/

}