import {Document} from "../../../src/decorator/Documents";
import {RelationWithMany, RelationWithOne} from "../../../src/decorator/Relations";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {ObjectID} from "mongodb";

@Document('sample1-post')
export class Post {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

}