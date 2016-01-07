import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {RelationWithMany} from "../../../src/decorator/Relation";
import {Category} from "./Category";
import {ObjectID} from "mongodb";

@Document('sample6-question')
export class Question {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    title: string;

    @Field()
    text: string;

    @RelationWithMany(type => Category, {
        cascadeInsert: true
    })
    categories: Category[] = [];

    constructor(title: string, text: string) {
        this.title = title;
        this.text  = text;
    }

}