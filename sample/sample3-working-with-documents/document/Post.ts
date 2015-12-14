import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";

@Document()
export class Post {

    @IdField(true)
    id: number;

    @Field()
    title: string;

    @Field()
    text: string;

}