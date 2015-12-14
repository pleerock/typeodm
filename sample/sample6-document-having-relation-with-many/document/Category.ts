import {Document} from "../../../src/decorator/Document";
import {Field} from "../../../src/decorator/Field";
import {RelationWithMany} from "../../../src/decorator/RelationWithMany";
import {IdField} from "../../../src/decorator/IdField";
import {ArrayField} from "../../../src/decorator/ArrayField";
import {Photo} from "./Photo";
import {Video} from "./Video";

@Document()
export class Category {

    @IdField(true)
    id: string;

    @Field()
    name: string;

    @RelationWithMany(type => Video)
    videos: Video[] = [];

    constructor(name: string) {
        this.name = name;
    }

}