import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithOne} from "../../../src/annotation/RelationWithOne";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {PhotoDetails} from "./PhotoDetails";

@Document()
export class Photo {

    @IdField(true)
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => PhotoDetails, null, {
        cascadeInsert: true,
        alwaysLeftJoin: true
    })
    details: PhotoDetails;

}