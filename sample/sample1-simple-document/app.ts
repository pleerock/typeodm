import {OdmFactory} from "../../src/OdmFactory";
import {Post} from "./document/Post";

/**
 * This sample is focused to teach on how to:
 *  - setup a connection with database
 *  - create a simple document
 *  - work with repositories:
 *      - create a new document
 *      - save a document
 *      - find one document
 *      - find multiple documents
 *
 * */

OdmFactory.createMongodbConnection('mongodb://localhost:27017/typeodm-samples', [__dirname + '/document']).then(connection => {
    console.log('Connection to mongodb is established');

    // NOTE: note that all operations in this example are asynchronous and order of console.log may be different
    // depending of what will finish execution first (for example insert usually takes more time then simple find
    // that's why its result console.logged the last, however in this example it is first console.logged).
    // We can create a right order by using chained promise syntax, but to simplify this example we didn't make it

    // get a post repository
    let postRepository = connection.getRepository<Post>(Post);

    // create a new post
    let post = postRepository.create(); // alternatively you can use: let post = new Post();
    post.title = 'Hello I am a new post';
    post.text = 'My name is Post and I am glad to see you';

    // save a post
    postRepository.persist(post).then(savedPost => {
        console.log('Post saved successfully: ');
        console.log(savedPost);

    }, error => console.log('Error during persisting: ' + error));

    // find a saved post
    postRepository.findOne({ title: 'Hello I am a new post' }).then(foundPost => {
        console.log('Found a saved post:');
        console.log(foundPost);

    }, error => console.log('Error during finding one: ' + error));

    // find all posts that exist in database
    postRepository.find().then(posts => {
        console.log('All posts:');
        console.log(posts);

    }, error => console.log('Error during find: ' + error));

}).catch(e => console.log('Error during connection to mongodb: ' + e));