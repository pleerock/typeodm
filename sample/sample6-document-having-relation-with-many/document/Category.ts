import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {ObjectIdField} from "../../../src/decorator/ObjectIdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {Photo} from "./Photo";
import {Video} from "./Video";

@Document('sample6-category')
export class Category {

    @ObjectIdField()
    id: string;

    @Field()
    name: string;

    @RelationWithMany(type => Video)
    videos: Video[] = [];

    constructor(name: string) {
        this.name = name;
    }

}