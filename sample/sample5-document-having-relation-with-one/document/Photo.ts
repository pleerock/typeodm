import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/Relation";
import {PhotoDetails} from "./PhotoDetails";
import {ObjectID} from "mongodb";

@Document('sample5-photo')
export class Photo {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => PhotoDetails, {
        cascadeInsert: true,
        alwaysLeftJoin: true
    })
    details: PhotoDetails;

}