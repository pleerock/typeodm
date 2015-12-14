import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {VoteAnswer} from "./VoteAnswer";

@Document()
export class VoteResult {

    @IdField()
    id: string;

    @Field()
    counter: number = 0;

    @RelationWithMany<VoteAnswer>(type => VoteAnswer, answer => answer.results, {
        cascadeInsert: false,
        cascadeRemove: true
    })
    voteAnswers: VoteAnswer[] = [];

}