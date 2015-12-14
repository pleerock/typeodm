import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithOne} from "../../../src/decorator/RelationWithOne";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";

@Document('blog_post')
export class Post {

    @IdField(true)
    id: string;

    @Field('title_name')
    title: string;

    @Field('text_content')
    text: string;

}