import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {ObjectID} from "mongodb";

@Document('sample8-post')
export class Post {

    @IdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

}