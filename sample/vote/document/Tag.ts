import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {VoteInfo} from "./VoteInfo";
import {VoteAnswer} from "./VoteAnswer";

@Document()
export class Tag {

    @IdField()
    id: string;

    @Field()
    name: string;

}