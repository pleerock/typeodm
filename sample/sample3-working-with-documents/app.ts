import {OdmFactory} from "../../src/OdmFactory";
import {Post} from "./document/Post";

/**
 * This sample is focused to teach on how to:
 *  - create a correct order of operations using promise chaining
 *  - update saved documents
 *  - remove saved documents
 *
 * */

OdmFactory.createMongodbConnection('mongodb://localhost:27017/typeodm-samples', [__dirname + '/document']).then(connection => {
    console.log('Connection to mongodb is established');

    // get a post repository
    let postRepository = connection.getRepository<Post>(Post);

    // create a new post
    let post = postRepository.create(); // alternatively you can use: let post = new Post();
    post.title = 'Hello I am a new post';
    post.text = 'My name is Post and I am glad to see you';

    // save a post
    postRepository.persist(post).then(savedPost => {

        // now, when we have a saved post lets try to update it
        savedPost.title = 'Hello I am updated post';
        savedPost.text = 'I am updated text of the post';
        return postRepository.persist(savedPost);

    }).then(updatedPost => {
        // updatedPost is available here because it is a results from the promise returned in a previous promise handler
        // this is standard promise chaining technique. if you are not familar with it, please read official promise docs

        console.log('Updated post:');
        console.log(updatedPost);

        // now lets remove our post
        return postRepository.remove(post); // updatedPost also can be used because its the same instance

    }).then(() => {
        console.log('Post removed');
        // now go to your mongodb explorer and check that you don't have any data in your collection

    }).catch(error => console.log('Error: ' + error));

}).catch(e => console.log('Error during connection to mongodb: ' + e));