import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithOne} from "../../../src/annotation/RelationWithOne";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {ArrayField} from "../../../src/annotation/ArrayField";
import {VoteInfo} from "./VoteInfo";
import {VoteAnswer} from "./VoteAnswer";

@Document()
export class Tag {

    @IdField()
    id: string;

    @Field()
    name: string;

}