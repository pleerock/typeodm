import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";
import {PhotoDetails} from "./PhotoDetails";

@Document('sample5-photo')
export class Photo {

    @ObjectIdField()
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