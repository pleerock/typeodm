import {Document} from "../../../src/decorator/Document";
import {RelationWithMany, RelationWithOne} from "../../../src/decorator/Relation";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
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