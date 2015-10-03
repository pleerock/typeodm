import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithOne} from "../../../src/annotation/RelationWithOne";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {VideoDetails} from "./VideoDetails";

@Document()
export class Video {

    @IdField()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => VideoDetails)
    details: VideoDetails;

}