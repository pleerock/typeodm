import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithOne} from "../../../src/decorator/Relations";
import {PhotoDetails} from "./PhotoDetails";
import {ObjectID} from "mongodb";

@Document("sample5-photo")
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