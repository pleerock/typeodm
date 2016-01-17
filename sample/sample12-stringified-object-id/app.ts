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
        console.log('type of saved post id: ', typeof savedPost.id);
        return postRepository.findOne({ title: 'Hello I am a new post' });

    }).then(foundPost => {

        console.log('Found a saved post by title:');
        console.log(foundPost);

        // now try to find same post but this time by id. note that we need to perform search by
        // object-id version of string
        let objectId = postRepository.utils.createObjectIdFromString(foundPost.id);
        console.log('id in the document: ', typeof foundPost.id, foundPost.id);
        console.log('transformed to object id: ', typeof objectId, objectId);
        return postRepository.findOne({ _id: objectId });
    }).then(foundPost => {

        console.log('Found a saved post by id:');
        console.log(foundPost);

    })
        .then(_ => connection.close())
        .catch(error => console.log('Error: ' + error));

}).catch(e => console.log('Error during connection to mongodb: ' + e));