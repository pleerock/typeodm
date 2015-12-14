import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
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