import {Document} from "../../src/decorator/Documents";
import {Field, IdField} from "../../src/decorator/Fields";
import {OdmFactory} from "../../src/OdmFactory";

@Document("user")
export class User {

    @IdField()
    id: string;

    @Field()
    email: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    age: number;

    @Field()
    isActive: boolean;
}

// first create a connection
OdmFactory.createMongodbConnection("mongodb://localhost:27017/testdb", [User]).then(connection => {

    // now create a new object
    let user = new User();
    user.id = "first-1";
    user.email = "johny@mail.com";
    user.firstName = "Johny";
    user.lastName = "Cage";
    user.age = 27;
    user.isActive = true;

    // finally save it
    let userRepository = connection.getRepository<User>(User);

    userRepository
        .persist(user)
        .then(user => console.log("User has been saved"))
        .catch(error => console.log("Cannot save. Error: ", error));

}, error => console.log("Cannot connect: ", error));