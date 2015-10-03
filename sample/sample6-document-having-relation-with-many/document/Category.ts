import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {ArrayField} from "../../../src/annotation/ArrayField";
import {Photo} from "./Photo";
import {Video} from "./Video";

@Document()
export class Category {

    @IdField()
    id: string;

    @Field()
    name: string;

    @RelationWithMany(type => Video)
    videos: Video[] = [];

    constructor(name: string) {
        this.name = name;
    }

}