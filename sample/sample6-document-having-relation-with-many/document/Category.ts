import {Document} from "../../../src/decorator/Document";
import {Field, ObjectIdField} from "../../../src/decorator/Field";
import {RelationWithMany} from "../../../src/decorator/Relation";
import {Photo} from "./Photo";
import {Video} from "./Video";
import {ObjectID} from "mongodb";

@Document('sample6-category')
export class Category {

    @ObjectIdField()
    id: ObjectID;

    @Field()
    name: string;

    @RelationWithMany(type => Video)
    videos: Video[] = [];

    constructor(name: string) {
        this.name = name;
    }

}