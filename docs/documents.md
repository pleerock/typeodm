## Documents and Fields

MongoDB is schemaless. In some cases this is good and convenient, however in your applications you may often want to
have a well-defined schema to make sure nothing redundant is saving to your database. Often in your application you
have a well-defined *Model* and you want to save only data that is defined in this model.

### Create a Model

First create a model. Lets say we want to create a user module, and we will create a **User** model:

```typescript
export class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    age: number;
    isActive: boolean;
}
```

### Make it a document

Now you need to tell that your model is a *document* saved to the db, and you need to specify what *fields* of your
model will be saved to the db:

```typescript
import {Document} from "typeodm/decorator/Documents";
import {Field} from "typeodm/decorator/Fields";

@Document("user")
export class User {

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
```

By adding `@Document` decorator we told odm that our User model will be used to work with mongodb and and we named
its mongodb collection as "user". We also used `@Field` to specify which model properties we want to save to db.

### Specify id field

Each document must have id field. You must specify which field of your document must be an *id field*.
In mongodb collection its saved to the `_id` field. We will not use mongodb's `ObjectId` as id field in this example.
In this example we just use string-typed id.

```typescript
import {Document} from "typeodm/decorator/Documents";
import {Field, IdField} from "typeodm/decorator/Fields";

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
```

In our document this field is called `id`. Note, that to mongodb collection it is saved as `_id`, and when you do
requests to mongodb you must use `_id` instead of your field name `id` in your queries. Don't forget about it.

### Save it

Now lets create a new user and save it to the database.

```typescript
import {OdmFactory} from "typeodm/OdmFactory";

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

}, error => console.log("connection error: ", error));
```

Here we set a new connection with mongodb database and saved our new `user` using `userRepository`.
Operations are asynchronous as usual and `userRepository.persist` returns you es6 `Promise`.
Run this code and you should have a user saved in your mongodb database:

```json
{
    "_id" : "first-1",
    "email" : "johny@mail.com",
    "firstName" : "Johny",
    "lastName" : "Cage",
    "age" : 27,
    "isActive" : true
}
```