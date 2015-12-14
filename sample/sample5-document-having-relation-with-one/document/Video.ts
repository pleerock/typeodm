import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {VideoDetails} from "./VideoDetails";

@Document()
export class Video {

    @IdField(true)
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => VideoDetails)
    details: VideoDetails;

}