import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithOne} from "../../../src/decorator/Relations";
import {RelationWithMany} from "../../../src/decorator/Relations";
import {Video} from "./Video";
import {ObjectID} from "mongodb";

@Document("sample5-video-details")
export class VideoDetails {

    @ObjectIdField()
    id: ObjectID;

    @RelationWithOne(type => Video)
    video: Video;

    @Field()
    createTime: number;

    @Field()
    updateTime: number;

    @Field()
    searchKeywords: string;

    @Field()
    searchDescription: string;

}