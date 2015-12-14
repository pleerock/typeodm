import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";
import {ArrayField} from "../../../src/decorator/ArrayField";

@Document()
export class Post {

    @ObjectIdField()
    id: number;

    @Field()
    title: string;

    @Field()
    text: string;

}