import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";
import {VideoDetails} from "./VideoDetails";

@Document()
export class Video {

    @ObjectIdField()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithOne(type => VideoDetails)
    details: VideoDetails;

}