import {OdmFactory} from "../../src/OdmFactory";
import {Post} from "./document/Post";
import {Category} from "./document/Category";
import {Question} from "./document/Question";
import {Photo} from "./document/Photo";
import {Video} from "./document/Video";
import {Vote} from "./document/Vote";

/**
 * This sample is focused to teach on how to:
 *  - create a document and create many-to-many relation between them
 *  - use cascade operations to insert related documents
 *  - use cascade operations to update related documents
 *  - use cascade operations to remove related documents
 *  - load the document with relations using odm joins
 *  - load the document with auto-loaded relations
 *  - use persist and load from both sides of relationships
 *  - perform cascade updates and removes
 * */

OdmFactory.createMongodbConnection("mongodb://localhost:27017/typeodm-samples", [__dirname + "/document"]).then(connection => {
    console.log("Connection to mongodb is established");

    // ----------------------------------------------------------------------
    // Insert related document. Example1 (regular hard way):
    // ----------------------------------------------------------------------

    // get repositories we need
    let postRepository = connection.getRepository<Post>(Post);
    let categoryRepository = connection.getRepository<Category>(Category);
    let questionRepository = connection.getRepository<Question>(Question);
    let photoRepository = connection.getRepository<Photo>(Photo);
    let videoRepository = connection.getRepository<Video>(Video);
    let voteRepository = connection.getRepository<Vote>(Vote);

    let category = new Category("Fruits");

    // create a new post
    let post = new Post("Hello I am a new post", "My name is Post and I am glad to see you");
    post.categories.push(category);

    // save a post
    postRepository.persist(post).then(savedPost => {
        console.log("Post is saved, but post category is not saved, because we didn\"t setup relation savings:");
        console.log(savedPost);

        // if you want to save a Category you need to manually save it:
        return categoryRepository.persist(category);

    }).then(savedCategory => {
        console.log("Saved post category:");
        console.log(savedCategory);
        console.log("Saved post: ");
        console.log(post);

        // we saved a post category, but relation between category and post is not set yet
        // to set it we need to save a post once again because only now it has a really saved post category with its id
        // remember that relation's owner is a Post, so you can do operations with this relation only with Post

        return postRepository.persist(post);

    }).then(savedPost => {
        console.log("Now we have a post with attached post category: ");
        console.log(savedPost);

        // now you probably wonder why it is so complicated? can I do it simply?
        // the answer is YES. you need to setup a cascade operations lets make it simple:

        // ----------------------------------------------------------------------
        // Insert related document. Example2 (easy way):
        // ----------------------------------------------------------------------

        let post = new Post("Hello I am a second post", "My name is Second Post and I am glad to see you");
        post.categories.push(new Category("Wow"));

        return postRepository.persist(post, postProperties => [{
            field: postProperties.categories,
            isInsert: true
        }]);
        // return postRepository.persist(post2, { category: { insert: true } });

    }).then(savedSecondPost => {
        console.log("Now both post and category are saved to the database:");
        console.log(savedSecondPost);

        // easy, yeah? you can make it even easier if you setup cascade operations on annotations of the document
        // to make this example to work lets switch to the Question document where cascade operations are setup on the annotations

        // ----------------------------------------------------------------------
        // Insert related document. Example3 (easiest way, annotations-level):
        // ----------------------------------------------------------------------

        let question = new Question("Hello I am a question", "My name is question and I am glad to see you");
        question.categories.push(new Category("Wow"));
        return questionRepository.persist(question);
        // see, no cascade operations are specified, because they are specified on annotations. Take a look on Question.ts

    }).then(savedQuestion => {
        console.log("Question is saved and its category too:");
        console.log(savedQuestion);

        // but sometimes you don't want your relation to be persisted
        // in this case you must override your annotations configuration by passing cascade options:

        // ----------------------------------------------------------------------
        // Persist related document. Example4 (overridden annotation's cascade options):
        // ----------------------------------------------------------------------

        let question2 = new Question("Hello I am a second question", "My name is Second question and I am glad to see you");
        question2.categories.push(new Category("Wow"));

        return questionRepository.persist(question2, questionProperties => [{
            field: questionProperties.categories,
            isInsert: false
        }]);

    }).then(savedSecondQuestion => {
        console.log("Your question is saved but category are not:");
        console.log(savedSecondQuestion);

        // lets now switch to examples that loads our documents with relations

        // ----------------------------------------------------------------------
        // Loading related documents. Example1 (using joins)
        // ----------------------------------------------------------------------

        return postRepository.findOne({ title: "Hello I am a new post" });

    }).then(post => {
        console.log("Post is loaded, but category are not:");
        console.log(post);

        // but we want to load post with category. How to do that? Simply using joins syntax:

        return postRepository.findOne({ title: "Hello I am a new post" }, null, postParameters => [{
            field: postParameters.categories
        }]);

    }).then(post => {
        console.log("Post is loaded, and this time with categories:");
        console.log(post);

        // good, now we can use joins and load our posts with related documents
        // what about "inner join" ability? YES, you can do it, just by adding "inner": true to the join field option:

        return questionRepository.findOne({ title: "Hello I am a second question" }, null, questionParameters => [{
            field: questionParameters.categories,
            inner: true
        }]);
        // questionRepository.findOne({ title: 'Hello I am a second question' }, { category: { inner: true } }

    }).then(question => {
        console.log("Question is not loaded, because it does not have category:");
        console.log(question);

        // nice, feel yourself like working with powerful relation database, hah?
        // now lets try to add condition to our joined relation

        return questionRepository.findOne({ text: "My name is question and I am glad to see you" }, null, questionParameters => [{
            field: questionParameters.categories,
            condition: {
                name: "Wow!!!"
            }
        }]);

    }).then(question => {
        console.log("Question is loaded, but category are not because no category found that matching that condition:");
        console.log(question);

        // ----------------------------------------------------------------------
        // Loading related documents. Example2 (using annotation)
        // ----------------------------------------------------------------------

        // if we put to RelationWithMany annotation a alwaysLeftJoin: true property then property will be loaded automatically
        // each time you request a document via find methods. For this example we gonna use Photo document because
        // this particular annotation is set there

        // lets insert a photo first
        let photo = new Photo("Hello I am a photo", "My name is photo and I am glad to see you");
        photo.categories.push(new Category("Nature"));
        return photoRepository.persist(photo); // no need to setup cascade operations because it already set in the Photo document

    }).then(savedPhoto => {
        // Now when we have saved photo, lets load it from the db:
        return photoRepository.findOne({ title: "Hello I am a photo" });

    }).then(photo => {
        console.log("Photo is loaded and category are loaded too because we set alwaysLeftJoin to true:");
        console.log(photo);

        // hint: you can use the same technique with alwaysRightJoin set to true if you want right joins
        // now lets try other operations

        // ----------------------------------------------------------------------
        // Insert from inverse side
        // ----------------------------------------------------------------------

        // your relation-with-one can be on both sides. For example Video has relation-with-one with VideoDetails
        // and VideoDetails also have relation-with-one with Video. This allows to perform operations including cascade
        // and joins from the both sides

        let video = new Video("Hello I am a video", "My name is video and I am glad to see you");
        let category = new Category("Nature");
        category.videos.push(video);

        // save a video category
        return categoryRepository.persist(category, categoryProperties => [{
            field: categoryProperties.videos,
            isInsert: true
        }]);

    }).then(category => {
        console.log("Video category is saved and its video is saved too:");
        console.log(category);

        // ----------------------------------------------------------------------
        // Load from inverse side
        // ----------------------------------------------------------------------

        // you can load video category and join its category now:

        return categoryRepository.findById(category.id, null, categoryProperties => [{
            field: categoryProperties.videos
        }]);

    }).then(videoDetails => {
        console.log("Video category is loaded with its video:");
        console.log(videoDetails);

        // ----------------------------------------------------------------------
        // Update related document. Example1: using cascades
        // ----------------------------------------------------------------------
        let category = new Category("Nature");
        let video = new Video("Hello I am a video", "My name is video and I am glad to see you");
        video.categories.push(category);

        // first save a new video with its category
        return videoRepository.persist(video, categoryProperties => [{
            field: categoryProperties.categories,
            isInsert: true
        }]);

    }).then(savedVideo => {

        // now lets try to update its category and save using cascade options
        savedVideo.categories[0].name = "Disasters";
        return videoRepository.persist(savedVideo, categoryProperties => [{
            field: categoryProperties.categories,
            isUpdate: true
        }]);

    }).then(updatedVideo => {

        // now lets try to reload to make sure video category are updated
        return videoRepository.findById(updatedVideo.id, null, videoProperties => [{
            field: videoProperties.categories
        }]);

    }).then(video => {
        console.log("Updated video: ");
        console.log(video);

        // ----------------------------------------------------------------------
        // Remove related document. Example1: using cascades
        // ----------------------------------------------------------------------

        video.categories.splice(0, 1); // todo: check

        return videoRepository.persist(video, categoryProperties => [{
            field: categoryProperties.categories,
            isRemove: true
        }]);

    }).then(videoWithoutDetails => {
        console.log("Video is updated and video category are removed from db: ");
        console.log(videoWithoutDetails);

        // ----------------------------------------------------------------------
        // Update related document. Example2: using annotations
        // ----------------------------------------------------------------------

        let category = new Category("Social");
        let vote = new Vote("Hello I am a vote", "My name is vote and I am glad to see you");
        vote.categories.push(category);

        // first save a new vote with its category
        return voteRepository.persist(vote);

    }).then(savedVote => {

        // now lets try to update its category and save it
        savedVote.categories[0].name = "Social Media";
        return voteRepository.persist(savedVote);

    }).then(updatedVote => {

        // now lets try to reload to make sure vote category are updated
        return voteRepository.findById(updatedVote.id, null, voteProperties => [{
            field: voteProperties.categories
        }]);

    }).then(vote => {
        console.log("Updated vote: ");
        console.log(vote);

        // ----------------------------------------------------------------------
        // Remove related document. Example2: using annotations
        // ----------------------------------------------------------------------

        vote.categories.splice(0, 1); // todo: check

        return voteRepository.persist(vote);

    }).then(video => {
        console.log("Vote is updated and vote category are removed from db: ");
        console.log(video);

    }).catch(error => console.log("Error: " + error));

}).catch(e => console.log("Error during connection to mongodb: " + e));