import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";
import {VoteDetails} from "./VoteDetails";

@Document()
export class Vote {

    @ObjectIdField()
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