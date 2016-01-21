import {Document} from "../../../src/decorator/Documents";
import {Field, ObjectIdField} from "../../../src/decorator/Fields";
import {RelationWithMany} from "../../../src/decorator/Relations";
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