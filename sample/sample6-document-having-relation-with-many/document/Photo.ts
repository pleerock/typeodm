import {Document} from "../../../src/annotation/Document";
import {Field} from "../../../src/annotation/Field";
import {RelationWithMany} from "../../../src/annotation/RelationWithMany";
import {IdField} from "../../../src/annotation/IdField";
import {Category} from "./Category";

@Document()
export class Photo {

    @IdField()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithMany(type => Category, null, {
        cascadeInsert: true,
        alwaysLeftJoin: true
    })
    categories: Category[] = [];

    constructor(title: string, text: string) {
        this.title = title;
        this.text  = text;
    }

}