import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithOne} from "../../../src/annotation/RelationWithOne";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {ArrayField} from "../../../src/annotation/ArrayField";
import {Video} from "./Video";

@Document()
export class VideoDetails {

    @IdField()
    id: string;

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