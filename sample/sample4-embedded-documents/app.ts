import {OdmFactory} from "../../src/OdmFactory";
import {Post} from "./document/Post";
import {PostAuthor} from "./document/PostAuthor";
import {PostTag} from "./document/PostTag";

/**
 * This sample is focused to teach on how to:
 *  - create a document with embedded documents
 *
 * */

OdmFactory.createMongodbConnection('mongodb://localhost:27017/typeodm-samples', [__dirname + '/document']).then(connection => {
    console.log('Connection to mongodb is established');

    // get a post repository
    let postRepository = connection.getRepository<Post>(Post);

    // create a post's author
    let author = new PostAuthor();
    author.firstName = 'David';
    author.lastName = 'Superman';

    // create a first tag for post
    let firstTag = new PostTag();
    firstTag.name = 'technologies';
    firstTag.description = 'Everything about new technologies';

    // create a second tag for post
    let secondTag = new PostTag();
    secondTag.name = 'programming';
    secondTag.description = 'Everything about programming';

    // create a new post
    let post = new Post();
    post.title = 'Hello I am a new post';
    post.text = 'My name is Post and I am glad to see you';
    post.author = author;
    post.tags = [firstTag, secondTag];

    // save a post
    postRepository.persist(post).then(savedPost => {
        console.log('Post saved successfully: ');
        console.log(savedPost);
        return postRepository.findOne({ title: 'Hello I am a new post' });

    }).then(foundPost => {
        console.log('Found a saved post:');
        console.log(foundPost);

    }).catch(error => console.log('Error: ' + error));

}).catch(e => console.log('Error during connection to mongodb: ' + e));