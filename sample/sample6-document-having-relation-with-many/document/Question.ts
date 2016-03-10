import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithMany} from "../../../src/decorator/Relations";
import {Category} from "./Category";
import {ObjectID} from "mongodb";

@Document("sample6-question")
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