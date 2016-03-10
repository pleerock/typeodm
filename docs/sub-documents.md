## Embedded Documents (sub-documents)

MongoDB documents maybe have embedded Documents (sub-documents). In your application subdocument is actually another
class which is enclosed in your model.

### Create Models

First create a **Photo** model which will be embedded to the **User** model.

```typescript
@EmbeddedDocument()
export class Photo {

    @IdField()
    id: string;

    @Field()
    filename: string;

    @Field()
    description: string;
}

@Document()
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

    @Field(type => Photo)
    photo: Photo;
}
```

As you can see your sub-documents must be decorated using `@EmbeddedDocument` decorator. Your original model that is
using subdocument have a simple field `photo: Photo` which is decorated with regular `@Field` decorator. The only
difference is that you must explicitly specify a type of document you'll use to the `@Field` decorator.

### Save it

Now lets create a new user with a photo and save it to the database.

```typescript
import {OdmFactory} from "typeodm/OdmFactory";

// first create a connection
OdmFactory.createMongodbConnection("mongodb://localhost:27017/testdb", [User]).then(connection => {

    // now create a new object
    let photo = new Photo();
    photo.id = "photo-1";
    photo.filename = "my-photo.jpg";
    photo.description = "Handsome";

    let user = new User();
    user.id = "second-2";
    user.email = "johny@mail.com";
    user.firstName = "Johny";
    user.lastName = "Cage";
    user.age = 27;
    user.isActive = true;
    user.photo = photo;

    // finally save it
    let userRepository = connection.getRepository<User>(User);

    userRepository
        .persist(user)
        .then(user => console.log("User with photo has been saved"))
        .catch(error => console.log("Cannot save. Error: ", error));

}, error => console.log("connection error: ", error));
```

Here we set a new connection with mongodb database, create two objects **user** and **photo**, where user contains
a photo, and saved our `user` using `userRepository`.
Operations are asynchronous as usual and `userRepository.persist` returns you es6 `Promise`.
Run this code and you should have a user saved in your mongodb database:

```json
{
    "_id" : "first-1",
    "email" : "johny@mail.com",
    "firstName" : "Johny",
    "lastName" : "Cage",
    "age" : 27,
    "isActive" : true,
    "photo": {
        "id": "second-2",
        "filename": "my-photo.jpg",
        "description": "Handsome"
    }
}
```