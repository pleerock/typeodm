import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {VoteResult} from "./VoteResult";
import {Vote} from "./Vote";

@Document()
export class VoteAnswer {

    @IdField()
    id: string;

    @Field()
    description: string;

    @RelationWithMany<VoteResult>(type => VoteResult, voteResult => voteResult.voteAnswers, {
        cascadeInsert: true,
        cascadeRemove: true
    })
    results: VoteResult[] = [];

    @RelationWithMany<Vote>(type => Vote, vote => vote.answers)
    votes: Vote[] = [];

   /* @RelationWithOne<QuestionInformation>(type => QuestionInformation, information => information.question, {
        cascadeInsert: false
    })
    information: QuestionInformation;

    @RelationWithMany<QuestionAnswer>(type => QuestionAnswer, questionAnswer => questionAnswer.question)
    answers: QuestionAnswer[] = [];*/

}