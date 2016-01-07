import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {RelationWithMany} from "../../../src/decorator/Relation";
import {Category} from "./Category";
import {ObjectID} from "mongodb";

@Document('sample6-vote')
export class Vote {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithMany(type => Category, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    categories: Category[] = [];

    constructor(title: string, text: string) {
        this.title = title;
        this.text  = text;
    }

}