import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {Index} from "../../../src/decorator/Index";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {CreateDateField} from "../../../src/decorator/CreateDateField";
import {VoteInfo} from "./VoteInfo";
import {VoteAnswer} from "./VoteAnswer";
import {Author} from "./Author";
import {Tag} from "./Tag";
import {VoteInfoData} from "./VoteInfoData";

@Document()
export class Vote {

    @IdField()
    id: string;

    @Field()
    @Index()
    title: string;

    @Field()
    description: string;

    @RelationWithOne<VoteInfo>(type => VoteInfo, info => info.vote, {
        cascadeInsert: true,
        cascadeRemove: true
    })
    information: VoteInfo;

    @RelationWithMany<VoteAnswer>(type => VoteAnswer, voteAnswer => voteAnswer.votes)
    answers: VoteAnswer[] = [];

    @RelationWithOne<VoteInfoData>(type => VoteInfoData, voteInfoData => voteInfoData.vote, {
        cascadeInsert: true
    })
    voteInfoData: VoteInfoData;

    @Field(type => Author)
    author: Author;

    @ArrayField(type => Tag)
    tags: Tag[] = [];

    @CreateDateField()
    createDate: Date;

}