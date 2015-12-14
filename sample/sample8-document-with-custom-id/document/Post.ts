import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";

@Document('post_with_number_id')
export class Post {

    @IdField()
    id: number;

    @Field()
    title: string;

    @Field()
    text: string;

}