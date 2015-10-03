import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithOne} from "../../../src/annotation/RelationWithOne";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {VoteDetails} from "./VoteDetails";

@Document()
export class Vote {

    @IdField()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => VoteDetails, null, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    details: VoteDetails;

}