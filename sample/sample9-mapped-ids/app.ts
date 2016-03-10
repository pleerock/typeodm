import {OdmFactory} from "../../src/OdmFactory";
import {Post} from "./document/Post";
import {Author} from "./document/Author";

/**
 * This sample is focused to teach on how to:
 *  - create a document with a custom document name
 *  - create a field with a custom field name
 * */

OdmFactory.createMongodbConnection("mongodb://localhost:27017/typeodm-samples", [__dirname + "/document"]).then(connection => {
    console.log("Connection to mongodb is established");

    // get a post repository
    let postRepository = connection.getRepository<Post>(Post);
    let authorRepository = connection.getRepository<Author>(Author);

    // create a new author
    let author = new Author();
    author.name = "Daron";

    // create a new post
    let post = postRepository.create();
    post.title = "Hello I am a new post";
    post.text = "My name is Post and I am glad to see you";
    post.author = author;

    // save a post
    postRepository.persist(post).then(savedPost => {
        console.log("Post saved successfully: ");
        console.log(savedPost);
        return postRepository.findById(savedPost.id);

    }).then(foundPost => {
        console.log("Found a saved post:");
        console.log(foundPost);

    })
        .then(_ => connection.close())
        .catch(error => console.log("Error: " + error));

}).catch(e => console.log("Error during connection to mongodb: " + e));