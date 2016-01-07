import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/Relation";
import {RelationWithMany} from "../../../src/decorator/Relation";
import {VideoDetails} from "./VideoDetails";
import {ObjectID} from "mongodb";

@Document('sample5-video')
export class Video {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => VideoDetails)
    details: VideoDetails;

}