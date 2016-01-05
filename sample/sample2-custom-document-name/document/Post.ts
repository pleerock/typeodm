import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";

@Document('sample2-post')
export class Post {

    @ObjectIdField()
    id: string;

    @Field('title_name')
    title: string;

    @Field('text_content')
    text: string;

}