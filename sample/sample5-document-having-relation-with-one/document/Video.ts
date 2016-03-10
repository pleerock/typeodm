import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithOne} from "../../../src/decorator/Relations";
import {RelationWithMany} from "../../../src/decorator/Relations";
import {VideoDetails} from "./VideoDetails";
import {ObjectID} from "mongodb";

@Document("sample5-video")
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