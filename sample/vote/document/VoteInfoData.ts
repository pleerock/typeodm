import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
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