import {OdmFactory} from "../../src/OdmFactory";
import {Post} from "./document/Post";
import {PostDetails} from "./document/PostDetails";
import {Question} from "./document/Question";
import {QuestionDetails} from "./document/QuestionDetails";
import {Photo} from "./document/Photo";
import {PhotoDetails} from "./document/PhotoDetails";
import {Video} from "./document/Video";
import {VideoDetails} from "./document/VideoDetails";
import {VoteDetails} from "./document/VoteDetails";
import {Vote} from "./document/Vote";

/**
 * This sample is focused to teach on how to:
 *  - create a document and create one-to-one relation between them
 *  - use cascade operations to insert related documents
 *  - use cascade operations to update related documents
 *  - use cascade operations to remove related documents
 *  - load the document with relations using odm joins
 *  - load the document with auto-loaded relations
 *  - use persist and load from both sides of relationships
 *  - perform cascade updates and removes
 * */

OdmFactory.createMongodbConnection('mongodb://localhost:27017/typeodm-samples', [__dirname + '/document']).then(connection => {
    console.log('Connection to mongodb is established');

    // ----------------------------------------------------------------------
    // Insert related document. Example1 (regular hard way):
    // ----------------------------------------------------------------------

    // get repositories we need
    let postRepository = connection.getRepository<Post>(Post);
    let postDetailsRepository = connection.getRepository<PostDetails>(PostDetails);
    let questionRepository = connection.getRepository<Question>(Question);
    let photoRepository = connection.getRepository<Photo>(Photo);
    let videoRepository = connection.getRepository<Video>(Video);
    let videoDetailsRepository = connection.getRepository<VideoDetails>(VideoDetails);
    let voteRepository = connection.getRepository<Vote>(Vote);

    let videoDetails = new PostDetails();
    videoDetails.createTime = new Date().getTime();
    videoDetails.updateTime  = new Date().getTime();
    videoDetails.searchDescription = 'Great post where you find everything you want';
    videoDetails.searchKeywords = 'post,typescript,odm,mongodb,javascript,es6,programming';

    // create a new post
    let post = postRepository.create(); // alternatively you can use: let post = new Post();
    post.title = 'Hello I am a new post';
    post.text = 'My name is Post and I am glad to see you';
    post.details = videoDetails;

    // save a post
    postRepository.persist(post).then(savedPost => {
        console.log('Post is saved, but post details are not saved, because we didn\'t setup relation savings:');
        console.log(savedPost);

        // if you want to save a PostDetails you need to manually save it:
        return postDetailsRepository.persist(videoDetails);

    }).then(savedPostDetails => {
        console.log('Saved post details: ');
        console.log(savedPostDetails);
        console.log('Saved post: ');
        console.log(post);

        // we saved a post details, but relation between details and post is not set yet
        // to set it we need to save a post once again because only now it has a really saved post details with its id
        // remember that one-to-one relation's owner is a Post, so you can do operations with this relation only with Post

        return postRepository.persist(post);

    }).then(savedPost => {
        console.log('Now we have a post with attached post details: ');
        console.log(savedPost);

        // now you probably wonder why it is so complicated? can I do it simply?
        // the answer is YES. you need to setup a cascade operations lets make it simple:

        // ----------------------------------------------------------------------
        // Insert related document. Example2 (easy way):
        // ----------------------------------------------------------------------

        let postDetails2 = new PostDetails();
        postDetails2.createTime = new Date().getTime();
        postDetails2.updateTime  = new Date().getTime();
        postDetails2.searchDescription = 'Second post where you find everything you want';
        postDetails2.searchKeywords = 'second-post,typescript,odm,mongodb,javascript';

        let post2 = postRepository.create(); // alternatively you can use: let post = new Post();
        post2.title = 'Hello I am a second post';
        post2.text = 'My name is Second Post and I am glad to see you';
        post2.details = postDetails2;

        return postRepository.persist(post2, postProperties => [{
            field: postProperties.details,
            isInsert: true
        }]);
        // return postRepository.persist(post2, { details: { insert: true } });

    }).then(savedSecondPost => {
        console.log('Now both post2 and postDetails2 are saved to the database:');
        console.log(savedSecondPost);

        // easy, yeah? you can make it even easier if you setup cascade operations on annotations of the document
        // to make this example to work lets switch to the Question document where cascade operations are setup on the annotations

        // ----------------------------------------------------------------------
        // Insert related document. Example3 (easiest way, annotations-level):
        // ----------------------------------------------------------------------

        let questionDetails = new QuestionDetails();
        questionDetails.createTime = new Date().getTime();
        questionDetails.updateTime  = new Date().getTime();
        questionDetails.searchDescription = 'question where you find everything you want';
        questionDetails.searchKeywords = 'question,typescript,odm,mongodb,javascript';

        let question = new Question();
        question.title = 'Hello I am a question';
        question.text = 'My name is question and I am glad to see you';
        question.details = questionDetails;

        return questionRepository.persist(question);
        // see, no cascade operations are specified, because they are specified on annotations. Take a look on Question.ts

    }).then(savedQuestion => {
        console.log('Question is saved and its details too:');
        console.log(savedQuestion);

        // but sometimes you don't want your relation to be persisted
        // in this case you must override your annotations configuration by passing cascade options:

        // ----------------------------------------------------------------------
        // Persist related document. Example4 (overridden annotation's cascade options):
        // ----------------------------------------------------------------------

        let questionDetails2 = new QuestionDetails();
        questionDetails2.createTime = new Date().getTime();
        questionDetails2.updateTime  = new Date().getTime();
        questionDetails2.searchDescription = 'Second question where you find everything you want';
        questionDetails2.searchKeywords = 'second-question,typescript,odm,mongodb,javascript';

        let question2 = new Question();
        question2.title = 'Hello I am a second question';
        question2.text = 'My name is Second question and I am glad to see you';
        question2.details = questionDetails2;

        return questionRepository.persist(question2, questionProperties => [{
            field: questionProperties.details,
            isInsert: false
        }]);

    }).then(savedSecondQuestion => {
        console.log('Your question is saved but details are not:');
        console.log(savedSecondQuestion);

        // lets now switch to examples that loads our documents with relations

        // ----------------------------------------------------------------------
        // Loading related documents. Example1 (using joins)
        // ----------------------------------------------------------------------

        return postRepository.findOne({ title: 'Hello I am a new post' });

    }).then(post => {
        console.log('Post is loaded, but details are not:');
        console.log(post);

        // but we want to load post with details. How to do that? Simply using joins syntax:

        return postRepository.findOne({ title: 'Hello I am a new post' }, null, postParameters => [{
            field: postParameters.details
        }]);

    }).then(post => {
        console.log('Post is loaded, and this time with details:');
        console.log(post);

        // good, now we can use joins and load our posts with related documents
        // what about "inner join" ability? YES, you can do it, just by adding "inner": true to the join field option:

        return questionRepository.findOne({ title: 'Hello I am a second question' }, null, questionParameters => [{
            field: questionParameters.details,
            inner: true
        }]);
        // questionRepository.findOne({ title: 'Hello I am a second question' }, { details: { inner: true } }

    }).then(question => {
        console.log('Question is not loaded, because it does not have details:');
        console.log(question);

        // nice, feel yourself like working with powerful relation database, hah?
        // now lets try to add condition to our joined relation

        return questionRepository.findOne({ text: 'My name is question and I am glad to see you' }, null, questionParameters => [{
            field: questionParameters.details,
            condition: {
                title: 'Hello I am a third question'
            }
        }]);

    }).then(question => {
        console.log('Question is loaded, but details are not because no details found that matching that condition:');
        console.log(question);

        // ----------------------------------------------------------------------
        // Loading related documents. Example2 (using annotation)
        // ----------------------------------------------------------------------

        // if we put to RelationWithOne annotation a alwaysLeftJoin: true property then property will be loaded automatically
        // each time you request a document via find methods. For this example we gonna use Photo document because
        // this particular annotation is set there

        // lets insert a photo first

        let photoDetails = new PhotoDetails();
        photoDetails.createTime = new Date().getTime();
        photoDetails.updateTime  = new Date().getTime();
        photoDetails.searchDescription = 'question where you find everything you want';
        photoDetails.searchKeywords = 'question,typescript,odm,mongodb,javascript';

        let photo = new Photo();
        photo.title = 'Hello I am a photo';
        photo.text = 'My name is photo and I am glad to see you';
        photo.details = photoDetails;

        return photoRepository.persist(photo); // no need to setup cascade operations because it already set in the Photo document

    }).then(savedPhoto => {
        // Now when we have saved photo, lets load it from the db:
        return photoRepository.findOne({ title: 'Hello I am a photo' });

    }).then(photo => {
        console.log('Photo is loaded and details are loaded too because we set alwaysLeftJoin to true:');
        console.log(photo);

        // hint: you can use the same technique with alwaysRightJoin set to true if you want right joins
        // now lets try other operations

        // ----------------------------------------------------------------------
        // Insert from inverse side
        // ----------------------------------------------------------------------

        // your relation-with-one can be on both sides. For example Video has relation-with-one with VideoDetails
        // and VideoDetails also have relation-with-one with Video. This allows to perform operations including cascade
        // and joins from the both sides

        let video = new Video();
        video.title = 'Hello I am a new video';
        video.text = 'My name is video and I am glad to see you';

        let videoDetails = new VideoDetails();
        videoDetails.createTime = new Date().getTime();
        videoDetails.updateTime  = new Date().getTime();
        videoDetails.searchDescription = 'Great video where you find everything you want';
        videoDetails.searchKeywords = 'video,typescript,odm,mongodb,javascript,es6,programming';
        videoDetails.video = video;

        // save a video details
        return videoDetailsRepository.persist(videoDetails, videoDetailsProperties => [{
            field: videoDetailsProperties.video,
            isInsert: true
        }]);

    }).then(videoDetails => {
        console.log('Video details is saved and its video is saved too:');
        console.log(videoDetails);

        // ----------------------------------------------------------------------
        // Load from inverse side
        // ----------------------------------------------------------------------

        // you can load video details and join its details now:

        return videoDetailsRepository.findById(videoDetails.id, null, videoDetailsProperties => [{
            field: videoDetailsProperties.video
        }]);

    }).then(videoDetails => {
        console.log('Video details is loaded with its video:');
        console.log(videoDetails);

        // ----------------------------------------------------------------------
        // Update related document. Example1: using cascades
        // ----------------------------------------------------------------------

        let details = new VideoDetails();
        details.createTime = new Date().getTime();
        details.updateTime  = new Date().getTime();
        details.searchDescription = 'Great video where you find everything you want';
        details.searchKeywords = 'video,typescript,odm,mongodb,javascript,es6,programming';

        let video = new Video();
        video.title = 'Hello I am a new video';
        video.text = 'My name is video and I am glad to see you';
        video.details = details;

        // first save a new video with its details
        return videoRepository.persist(video, videoDetailsProperties => [{
            field: videoDetailsProperties.details,
            isInsert: true
        }]);

    }).then(savedVideo => {

        // now lets try to update its details and save using cascade options
        savedVideo.details.searchDescription = 'I am updated video title';
        return videoRepository.persist(savedVideo, videoDetailsProperties => [{
            field: videoDetailsProperties.details,
            isUpdate: true
        }]);

    }).then(updatedVideo => {

        // now lets try to reload to make sure video details are updated
        return videoRepository.findById(updatedVideo.id, null, videoProperties => [{
            field: videoProperties.details
        }]);

    }).then(video => {
        console.log('Updated video: ');
        console.log(video);

        // ----------------------------------------------------------------------
        // Remove related document. Example1: using cascades
        // ----------------------------------------------------------------------

        video.details = null;

        return videoRepository.persist(video, videoDetailsProperties => [{
            field: videoDetailsProperties.details,
            isRemove: true
        }]);

    }).then(videoWithoutDetails => {
        console.log('Video is updated and video details are removed from db: ');
        console.log(videoWithoutDetails);

        // ----------------------------------------------------------------------
        // Update related document. Example2: using annotations
        // ----------------------------------------------------------------------

        let details = new VoteDetails();
        details.createTime = new Date().getTime();
        details.updateTime  = new Date().getTime();
        details.searchDescription = 'Great vote where you find everything you want';
        details.searchKeywords = 'vote,typescript,odm,mongodb,javascript,es6,programming';

        let vote = new Vote();
        vote.title = 'Hello I am a new vote';
        vote.text = 'My name is vote and I am glad to see you';
        vote.details = details;

        // first save a new vote with its details
        return voteRepository.persist(vote);

    }).then(savedVote => {

        // now lets try to update its details and save it
        savedVote.details.searchDescription = 'I am updated vote title';
        return voteRepository.persist(savedVote);

    }).then(updatedVote => {

        // now lets try to reload to make sure vote details are updated
        return voteRepository.findById(updatedVote.id, null, voteProperties => [{
            field: voteProperties.details
        }]);

    }).then(vote => {
        console.log('Updated vote: ');
        console.log(vote);

        // ----------------------------------------------------------------------
        // Remove related document. Example2: using annotations
        // ----------------------------------------------------------------------

        vote.details = null;

        return voteRepository.persist(vote);

    }).then(video => {
        console.log('Vote is updated and vote details are removed from db: ');
        console.log(video);

    }).catch(error => console.log('Error: ' + error));

}).catch(e => console.log('Error during connection to mongodb: ' + e));