import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/Relation";
import {RelationWithMany} from "../../../src/decorator/Relation";
import {Video} from "./Video";
import {ObjectID} from "mongodb";

@Document('sample5-video-details')
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