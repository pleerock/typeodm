import * as chai from "chai";
import {expect} from "chai";
import {OdmFactory} from "../../../src/OdmFactory";
import {Connection} from "../../../src/connection/Connection";
import {Repository} from "../../../src/repository/Repository";
import {Post} from "../../../sample/sample5-document-having-relation-with-one/document/Post";
import {Photo} from "../../../sample/sample5-document-having-relation-with-one/document/Photo";
import {Question} from "../../../sample/sample5-document-having-relation-with-one/document/Question";
import {PostDetails} from "../../../sample/sample5-document-having-relation-with-one/document/PostDetails";
import {PhotoDetails} from "../../../sample/sample5-document-having-relation-with-one/document/PhotoDetails";
import {Video} from "../../../sample/sample5-document-having-relation-with-one/document/Video";
import {VideoDetails} from "../../../sample/sample5-document-having-relation-with-one/document/VideoDetails";
import {Vote} from "../../../sample/sample5-document-having-relation-with-one/document/Vote";
import {VoteDetails} from "../../../sample/sample5-document-having-relation-with-one/document/VoteDetails";
import {QuestionDetails} from "../../../sample/sample5-document-having-relation-with-one/document/QuestionDetails";
import {ObjectID} from "mongodb";

chai.should();
describe('sample5-document-having-relation-with-one', function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    // connect to db
    let connection: Connection;
    before(function() {
        return OdmFactory.createMongodbConnection('mongodb://localhost:27017/testdb', [__dirname + '/../../../sample/sample5-document-having-relation-with-one/document']).then(conn => {
            connection = conn;
        }).catch(e => console.log('Error during connection to mongodb: ' + e));
    });

    after(function() {
        connection.close();
    });

    // drop database before each test
    beforeEach(function() {
        return connection.driver.dropDatabase();
    });

    let postRepository: Repository<Post>,
        postDetailsRepository: Repository<PostDetails>,
        questionRepository: Repository<Question>,
        photoRepository: Repository<Photo>,
        videoRepository: Repository<Video>,
        videoDetailsRepository: Repository<VideoDetails>,
        voteRepository: Repository<Vote>,
        voteDetailsRepository: Repository<VoteDetails>;

    beforeEach(function() {
        postRepository = connection.getRepository<Post>(Post);
        postDetailsRepository = connection.getRepository<PostDetails>(PostDetails);
        questionRepository = connection.getRepository<Question>(Question);
        photoRepository = connection.getRepository<Photo>(Photo);
        videoRepository = connection.getRepository<Video>(Video);
        videoDetailsRepository = connection.getRepository<VideoDetails>(VideoDetails);
        voteRepository = connection.getRepository<Vote>(Vote);
        voteDetailsRepository = connection.getRepository<VoteDetails>(VoteDetails);
    });

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    describe('insert new post without any cascade operations', function() {
        let newPost: Post, newPostDetails: PostDetails;

        beforeEach(function() {
            newPostDetails = new PostDetails();
            newPostDetails.createTime = new Date().getTime();
            newPostDetails.updateTime  = new Date().getTime();
            newPostDetails.searchDescription = 'Great post where you find everything you want';
            newPostDetails.searchKeywords = 'post,typescript,odm,mongodb,javascript,es6,programming';

            // create a new post
            newPost = postRepository.create();
            newPost.title = 'Hello I am a new post';
            newPost.text = 'My name is Post and I am glad to see you';
            newPost.details = newPostDetails;
        });

        it('should successfully insert a new post', function () {
            return postRepository.persist(newPost);
        });

        it('should insert a new post and return the same post instance as we sent', function() {
            return postRepository.persist(newPost).then(insertedPost => {
                insertedPost.should.be.equal(newPost);
            });
        });

        it('should have a new generated id after post is created', function () {
            return postRepository.persist(newPost).then(savedPost => {
                expect(savedPost.id).not.to.be.empty;
            });
        });

        it('should return a post and its details without id since details are not saved to db', function () {
            return postRepository.persist(newPost).then(savedPost => {
                expect(savedPost.details.id).to.be.empty;
            });
        });

        it('should insert a post and it should exist in db, but details should be empty since they are not saved to db', function () {
            let id: ObjectID;
            return postRepository.persist(newPost).then(savedPost => {
                id = savedPost.id;
                return postRepository.findOne({
                    title: 'Hello I am a new post'
                });
            }).then(foundPost => {
                foundPost.should.be.eql({
                    id: id,
                    title: 'Hello I am a new post',
                    text: 'My name is Post and I am glad to see you'
                });
                expect(foundPost.details).to.be.empty;
            });
        });

    });

    describe('insert new post with cascade operation', function() {
        let newPost: Post, newPostDetails: PostDetails, time = new Date().getTime();

        beforeEach(function() {
            newPostDetails = new PostDetails();
            newPostDetails.createTime = time;
            newPostDetails.updateTime  = time;
            newPostDetails.searchDescription = 'Great post where you find everything you want';
            newPostDetails.searchKeywords = 'post,typescript,odm,mongodb,javascript,es6,programming';

            // create a new post
            newPost = postRepository.create();
            newPost.title = 'Hello I am a new post';
            newPost.text = 'My name is Post and I am glad to see you';
            newPost.details = newPostDetails;
        });

        it('should successfully insert a new post', function () {
            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.details,
                insert: true
            }]);
        });

        it('should insert a new post and return the same post instance as we sent', function() {
            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.details,
                insert: true
            }]).then(insertedPost => {
                insertedPost.should.be.equal(newPost);
            });
        });

        it('should have a new generated id after post is created', function () {
            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.details,
                insert: true
            }]).then(savedPost => {
                expect(savedPost.details.id).not.to.be.empty;
            });
        });

        it('should return a post and its details should have id since they are saved to db', function () {
            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.details,
                insert: true
            }]).then(savedPost => {
                expect(savedPost.details.id).not.to.be.empty;
            });
        });

        it('should return a post and its details should have id since they are saved to db. fetch it', function () {
            let postId: ObjectID, detailsId: ObjectID;
            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.details,
                insert: true
            }]).then(savedPost => {
                postId = savedPost.id;
                detailsId = savedPost.details.id;
                return postRepository.findOne({
                    title: 'Hello I am a new post'
                }, null, postProperties => [{
                    field: postProperties.details
                }]);
            }).then(foundPost => {
                foundPost.should.be.eql({
                    id: postId,
                    title: 'Hello I am a new post',
                    text: 'My name is Post and I am glad to see you',
                    details: {
                        id: detailsId,
                        createTime: time,
                        updateTime: time,
                        searchDescription: 'Great post where you find everything you want',
                        searchKeywords: 'post,typescript,odm,mongodb,javascript,es6,programming'
                    }
                });
            });
        });

    });

    describe('insert new question cascaded by annotation option', function() {
        let newQuestion: Question, newQuestionDetails: QuestionDetails, time = new Date().getTime();

        beforeEach(function() {
            newQuestionDetails = new QuestionDetails();
            newQuestionDetails.createTime = time;
            newQuestionDetails.updateTime = time;
            newQuestionDetails.searchDescription = 'Great question where you find everything you want';
            newQuestionDetails.searchKeywords = 'question,typescript,odm,mongodb,javascript,es6,programming';

            // create a new post
            newQuestion = questionRepository.create();
            newQuestion.title = 'Hello I am a new question';
            newQuestion.text = 'My name is question and I am glad to see you';
            newQuestion.details = newQuestionDetails;
        });

        it('should successfully insert a new question', function () {
            return questionRepository.persist(newQuestion);
        });

        it('should insert a new question and return the same question instance as we sent', function() {
            return questionRepository.persist(newQuestion).then(insertedQuestion => {
                insertedQuestion.should.be.equal(newQuestion);
            });
        });

        it('should have a new generated id after question is created', function () {
            return questionRepository.persist(newQuestion).then(savedQuestion => {
                expect(savedQuestion.details.id).not.to.be.empty;
            });
        });

        it('should return a question and its details should have id since they are saved to db', function () {
            return questionRepository.persist(newQuestion).then(savedQuestion => {
                expect(savedQuestion.details.id).not.to.be.empty;
            });
        });

        it('should return a question and its details should have id since they are saved to db. fetch it', function () {
            let questionId: ObjectID, detailsId: ObjectID;
            return questionRepository.persist(newQuestion).then(savedQuestion => {
                questionId = savedQuestion.id;
                detailsId = savedQuestion.details.id;
                return questionRepository.findOne({
                    title: 'Hello I am a new question'
                }, null, questionProperties => [{
                    field: questionProperties.details
                }]);
            }).then(foundQuestion => {
                foundQuestion.should.be.eql({
                    id: questionId,
                    title: 'Hello I am a new question',
                    text: 'My name is question and I am glad to see you',
                    details: {
                        id: detailsId,
                        createTime: time,
                        updateTime: time,
                        searchDescription: 'Great question where you find everything you want',
                        searchKeywords: 'question,typescript,odm,mongodb,javascript,es6,programming'
                    }
                });
            });
        });

        it('should not insert a details of the question if implicit cascade options given where insert is denied', function () {
            let questionId: ObjectID, detailsId: ObjectID;
            return questionRepository.persist(newQuestion, questionProperties => [{
                field: questionProperties.details,
                insert: false
            }]).then(savedQuestion => {
                questionId = savedQuestion.id;
                detailsId = savedQuestion.details.id;
                return questionRepository.findOne({
                    title: 'Hello I am a new question'
                }, null, questionProperties => [{
                    field: questionProperties.details
                }]);
            }).then(foundQuestion => {
                foundQuestion.should.be.eql({
                    id: questionId,
                    title: 'Hello I am a new question',
                    text: 'My name is question and I am glad to see you'
                });
                expect(foundQuestion.details).to.be.empty;
            });
        });

    });

    describe('load a post depend of cascade options set', function() {
        let postId: ObjectID, detailsId: ObjectID, time = new Date().getTime();

        beforeEach(function() {
            let newPostDetails = new PostDetails();
            newPostDetails.createTime = time;
            newPostDetails.updateTime = time;
            newPostDetails.searchDescription = 'Great post where you find everything you want';
            newPostDetails.searchKeywords = 'post,typescript,odm,mongodb,javascript,es6,programming';

            // create a new post
            let newPost = postRepository.create();
            newPost.title = 'Hello I am a new post';
            newPost.text = 'My name is Post and I am glad to see you';
            newPost.details = newPostDetails;

            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.details,
                insert: true
            }]).then(post => {
                postId = post.id;
                detailsId = post.details.id;
            });
        });

        it('should load a post without details if cascade options are not specified', function () {
            return postRepository.findById(postId).then(post => {
                expect(post.details).to.be.undefined;
            });
        });

        it('should load a post with details if cascade options are specified', function () {
            return postRepository.findById(postId, null, postParameters => [{
                field: postParameters.details
            }]).then(post => {
                post.details.should.be.eql({
                    id: detailsId,
                    createTime: time,
                    updateTime: time,
                    searchDescription: 'Great post where you find everything you want',
                    searchKeywords: 'post,typescript,odm,mongodb,javascript,es6,programming'
                });
            });
        });

    });

    describe('load a post depend of inner/left join option set', function() {
        let postWithoutDetailsId: ObjectID, postWithDetailsId: ObjectID, detailsId: ObjectID, time = new Date().getTime();

        beforeEach(function() {
            let newPostDetails = new PostDetails();
            newPostDetails.createTime = time;
            newPostDetails.updateTime = time;
            newPostDetails.searchDescription = 'Great post where you find everything you want';
            newPostDetails.searchKeywords = 'post,typescript,odm,mongodb,javascript,es6,programming';

            // create a new post
            let postWithDetails = postRepository.create();
            postWithDetails.title = 'Hello I am a new post';
            postWithDetails.text = 'My name is Post and I am glad to see you';
            postWithDetails.details = newPostDetails;

            // create a new post
            let postWithoutDetails = postRepository.create();
            postWithoutDetails.title = 'Hello I am post without details';
            postWithoutDetails.text = 'My name is Post and I am glad to see you';

            return postRepository.persist(postWithoutDetails).then(post => {
                postWithoutDetailsId = post.id;
                return postRepository.persist(postWithDetails, postProperties => [{
                    field: postProperties.details,
                    insert: true
                }]);
            }).then(post => {
                postWithDetailsId = post.id;
                detailsId = post.details.id;
            });
        });

        it('should load the post that don\'t have details if standard (left) join is used', function () {
            return postRepository.findById(postWithoutDetailsId, null, postParameters => [{
                field: postParameters.details
            }]).then(post => {
                post.should.not.be.empty;
                //expect(post.details).to.be.undefined;
            });
        });

        it('should not load the post that don\'t have details if inner join is used', function () {
            return postRepository.findById(postWithoutDetailsId, null, postParameters => [{
                field: postParameters.details,
                inner: true
            }]).then(post => {
                expect(post).to.be.null;
            });
        });

        it('should load the post that have details if inner join is used', function () {
            return postRepository.findById(postWithDetailsId, null, postParameters => [{
                field: postParameters.details,
                inner: true
            }]).then(post => {
                post.should.not.be.empty;
                post.details.should.not.be.empty;
            });
        });

    });

    describe('load a post\'s details depend of extra conditions', function() {
        let postId: ObjectID, detailsId: ObjectID, time = new Date().getTime();

        beforeEach(function() {
            let postDetails = new PostDetails();
            postDetails.createTime = time;
            postDetails.updateTime = time;
            postDetails.searchDescription = 'Great post where you find everything you want';
            postDetails.searchKeywords = 'post,typescript,odm,mongodb,javascript,es6,programming';

            // create a new post
            let post = postRepository.create();
            post.title = 'Hello I am a new post';
            post.text = 'My name is Post and I am glad to see you';
            post.details = postDetails;

            return postRepository.persist(post).then(post => {
                postId = post.id;
                return postRepository.persist(post, postProperties => [{
                    field: postProperties.details,
                    insert: true
                }]);
            }).then(post => {
                postId = post.id;
                detailsId = post.details.id;
            });
        });

        it('should load the post that don\'t have details if no condition is used', function () {
            return postRepository.findById(postId, null, postParameters => [{
                field: postParameters.details
            }]).then(post => {
                post.should.not.be.empty;
            });
        });

        it('should load the post and its details if condition is used and condition matches', function () {
            return postRepository.findById(postId, null, postParameters => [{
                field: postParameters.details,
                condition: {
                    searchDescription: 'Great post where you find everything you want'
                }
            }]).then(post => {
                post.should.not.be.empty;
                post.details.should.not.be.empty;
            });
        });

        it('should load the post but don\'t load its details if condition is used and condition doesn\'t match', function () {
            return postRepository.findById(postId, null, postParameters => [{
                field: postParameters.details,
                condition: {
                    searchDescription: 'Bad post where you don\'t find anything'
                }
            }]).then(post => {
                expect(post).not.to.be.empty;
                expect(post.details).to.be.empty;
            });
        });

        it('should not load the post and its details if condition doesn\'t match and inner join is used', function () {
            return postRepository.findById(postId, null, postParameters => [{
                field: postParameters.details,
                inner: true,
                condition: {
                    searchDescription: 'Bad post where you don\'t find anything'
                }
            }]).then(post => {
                expect(post).to.be.null;
            });
        });

    });

    describe('load photo and its details automatically because always left join annotation is set on its properties', function() {
        let photoId: ObjectID, detailsId: ObjectID, time = new Date().getTime();

        beforeEach(function() {
            let photoDetails = new PhotoDetails();
            photoDetails.createTime = time;
            photoDetails.updateTime = time;
            photoDetails.searchDescription = 'Great photo where you find everything you want';
            photoDetails.searchKeywords = 'photo,typescript,odm,mongodb,javascript,es6,programming';

            // create a new post
            let photo = photoRepository.create();
            photo.title = 'Hello I am a new photo';
            photo.text = 'My name is photo and I am glad to see you';
            photo.details = photoDetails;

            return photoRepository.persist(photo).then(photo => {
                photoId = photo.id;
                return photoRepository.persist(photo, photoProperties => [{
                    field: photoProperties.details,
                    insert: true
                }]);
            }).then(photo => {
                photoId = photo.id;
                detailsId = photo.details.id;
            });
        });

        it('should load the photo with its details automatically without joins set', function () {
            return photoRepository.findById(photoId).then(photo => {
                expect(photo).not.to.be.empty;
                expect(photo.details).not.to.be.empty;
            });
        });

    });

    describe('load and insert from inverse side too', function() {
        let video: Video, videoDetails: VideoDetails, time = new Date().getTime();

        beforeEach(function() {
            video = new Video();
            video.title = 'Hello I am a new video';
            video.text = 'My name is video and I am glad to see you';

            videoDetails = new VideoDetails();
            videoDetails.createTime = time;
            videoDetails.updateTime = time;
            videoDetails.searchDescription = 'Great video where you find everything you want';
            videoDetails.searchKeywords = 'video,typescript,odm,mongodb,javascript,es6,programming';
            videoDetails.video = video;
        });

        it('should insert a video and its details', function () {
            return videoDetailsRepository.persist(videoDetails, videoDetailsProperties => [{
                field: videoDetailsProperties.video,
                insert: true
            }]).then(videoDetails => {
                expect(videoDetails.id).not.to.be.empty;
                expect(videoDetails.video.id).not.to.be.empty;
            });
        });

        it('should insert a video and its details', function () {
            return videoDetailsRepository.persist(videoDetails, videoDetailsProperties => [{
                field: videoDetailsProperties.video,
                insert: true
            }]).then(() => {
                return videoDetailsRepository.findById(videoDetails.id, null, videoDetailsProperties => [{
                    field: videoDetailsProperties.video
                }]);
            }).then(videoDetails => {
                expect(videoDetails).not.to.be.empty;
                expect(videoDetails.video).not.to.be.empty;
            });
        });

    });

    describe('cascade update and remove operations via cascade settings', function() {
        let video: Video, videoDetails: VideoDetails, time = new Date().getTime();

        beforeEach(function() {

            videoDetails = new VideoDetails();
            videoDetails.createTime = time;
            videoDetails.updateTime = time;
            videoDetails.searchDescription = 'Great video where you find everything you want';
            videoDetails.searchKeywords = 'video,typescript,odm,mongodb,javascript,es6,programming';

            video = new Video();
            video.title = 'Hello I am a new video';
            video.text = 'My name is video and I am glad to see you';
            video.details = videoDetails;

            return videoRepository.persist(video, videoProperties => [{
                field: videoProperties.details,
                insert: true
            }]);
        });

        it('should not update video details if cascade options are not given', function () {
            video.details.searchDescription = 'I am updated video description';
            return videoRepository.persist(video, videoProperties => [{
                field: videoProperties.details,
                insert: true
            }]).then(() => {
                return videoRepository.findById(video.id, null, videoParameters => [{
                    field: videoParameters.details
                }]);
            }).then(video => {
                // todo: fix
                video.details.searchDescription.should.be.equal('Great video where you find everything you want');
            });
        });

        it('should update video details if cascade options are given', function () {
            video.details.searchDescription = 'I am updated video description';
            return videoRepository.persist(video, videoProperties => [{
                field: videoProperties.details,
                update: true
            }]).then(() => {
                return videoRepository.findById(video.id, null, videoParameters => [{
                    field: videoParameters.details
                }]);
            }).then(video => {
                video.details.searchDescription.should.be.equal('I am updated video description');
                video.details.searchDescription.should.not.be.equal('Great video where you find everything you want');
            });
        });

        it('should not remove video details if cascade options are not given', function () {
            video.details = null;
            return videoRepository.persist(video, videoProperties => [{
                field: videoProperties.details,
                update: true
            }]).then(() => {
                return videoDetailsRepository.findById(videoDetails.id);
            }).then(videoDetails => {
                expect(videoDetails).not.to.be.null;
            });
        });

        it('should remove video details if cascade options are given', function () {
            video.details = null;
            return videoRepository.persist(video, videoProperties => [{
                field: videoProperties.details,
                remove: true
            }]).then(() => {
                return videoDetailsRepository.findById(videoDetails.id);
            }).then(videoDetails => {
                expect(videoDetails).to.be.null;
            });
        });

    });

    describe('cascade update and remove operations via annotations', function() {
        let vote: Vote, voteDetails: VoteDetails, time = new Date().getTime();

        beforeEach(function() {
            voteDetails = new VoteDetails();
            voteDetails.createTime = time;
            voteDetails.updateTime = time;
            voteDetails.searchDescription = 'Great vote where you find everything you want';
            voteDetails.searchKeywords = 'vote,typescript,odm,mongodb,javascript,es6,programming';

            vote = new Vote();
            vote.title = 'Hello I am a new vote';
            vote.text = 'My name is vote and I am glad to see you';
            vote.details = voteDetails;

            return voteRepository.persist(vote);
        });

        it('should update vote details because annotation is set', function () {
            vote.details.searchDescription = 'I am updated vote description';
            return voteRepository.persist(vote).then(() => {
                return voteRepository.findById(vote.id, null, videoParameters => [{
                    field: videoParameters.details
                }]);
            }).then(vote => {
                vote.details.searchDescription.should.be.equal('I am updated vote description');
                vote.details.searchDescription.should.not.be.equal('Great vote where you find everything you want');
            });
        });

        it('should not update vote details if implicit cascade options are given', function () {
            vote.details.searchDescription = 'I am updated vote description';
            return voteRepository.persist(vote, voteProperties => [{
                field: voteProperties.details,
                update: false
            }]).then(() => {
                return voteRepository.findById(vote.id, null, voteParameters => [{
                    field: voteParameters.details
                }]);
            }).then(vote => {
                vote.details.searchDescription.should.be.equal('Great vote where you find everything you want');
            });
        });

        it('should not remove vote details if cascade options are not given', function () {
            vote.details = null;
            return voteRepository.persist(vote).then(() => {
                return voteDetailsRepository.findById(voteDetails.id);
            }).then(voteDetails => {
                expect(voteDetails).to.be.null;
            });
        });

    });


});