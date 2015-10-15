import {OdmFactory} from "../../src/OdmFactory";
import {Post} from "./document/Post";

/**
 * This sample is focused to teach on how to:
 *  - create a document with a custom document name
 *  - create a field with a custom field name
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
        console.log('Post saved successfully: ');
        console.log(savedPost);
        return postRepository.findOne({ title_name: 'Hello I am a new post' });

        // you probably noticed that instead of 'title' we used 'title_name'
        // YES, here you MUST to use your custom field names, the names that are used in the mongodb, not your class fields properties
        // this restriction is required because we cannot abstract safely dynamic requests that are going to mongodb
        // generally we don't recommend to use custom names to prevent any confusion

    }).then(foundPost => {
        // foundPost is available here because it is a results from the promise returned in a previous promise handler
        // this is standard promise chaining technique. if you are not familar with it, please read official promise docs

        console.log('Found a saved post:');
        console.log(foundPost);
        // now go to your mongodb explorer and check how your collection is named and raw data is stored

    })
        .then(_ => connection.close())
        .catch(error => console.log('Error: ' + error));

}).catch(e => console.log('Error during connection to mongodb: ' + e));