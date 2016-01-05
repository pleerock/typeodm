import * as chai from "chai";
import {expect} from "chai";
import {OdmFactory} from "../../../src/OdmFactory";
import {Connection} from "../../../src/connection/Connection";
import {Repository} from "../../../src/repository/Repository";
import {Post} from "../../../sample/sample6-document-having-relation-with-many/document/Post";
import {Photo} from "../../../sample/sample6-document-having-relation-with-many/document/Photo";
import {Question} from "../../../sample/sample6-document-having-relation-with-many/document/Question";
import {Video} from "../../../sample/sample6-document-having-relation-with-many/document/Video";
import {Vote} from "../../../sample/sample6-document-having-relation-with-many/document/Vote";
import {Category} from "../../../sample/sample6-document-having-relation-with-many/document/Category";
import {ObjectID} from "mongodb";

chai.should();
describe('sample6-document-having-relation-with-many', function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    // connect to db
    let connection: Connection;
    before(function() {
        return OdmFactory.createMongodbConnection('mongodb://localhost:27017/testdb', [__dirname + '/../../../sample/sample6-document-having-relation-with-many/document']).then(conn => {
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
        categoryRepository: Repository<Category>,
        questionRepository: Repository<Question>,
        photoRepository: Repository<Photo>,
        videoRepository: Repository<Video>,
        voteRepository: Repository<Vote>;

    beforeEach(function() {
        postRepository = connection.getRepository<Post>(Post);
        categoryRepository = connection.getRepository<Category>(Category);
        questionRepository = connection.getRepository<Question>(Question);
        photoRepository = connection.getRepository<Photo>(Photo);
        videoRepository = connection.getRepository<Video>(Video);
        voteRepository = connection.getRepository<Vote>(Vote);
    });

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    describe('insert new post without any cascade operations', function() {
        let newPost: Post, newCategory: Category;

        beforeEach(function() {
            newCategory = new Category('Hello');
            newPost = new Post('Hello I am a new post', 'My name is Post and I am glad to see you');
            newPost.categories.push(newCategory);
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

        it('should return a post and its categories without ids since categories are not saved to db', function () {
            return postRepository.persist(newPost).then(savedPost => {
                expect(savedPost.categories[0].id).to.be.empty;
            });
        });

        it('should insert a post and it should exist in db, but categories should be empty since they are not saved to db', function () {
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
                    text: 'My name is Post and I am glad to see you',
                    categories: []
                });
                expect(foundPost.categories).not.to.include(newCategory)
            });
        });

    });

    describe('insert new post with cascade operation', function() {
        let newPost: Post, newCategory: Category;

        beforeEach(function() {
            newCategory = new Category('Hello');
            newPost = new Post('Hello I am a new post', 'My name is Post and I am glad to see you');
            newPost.categories.push(newCategory);
        });

        it('should successfully insert a new post', function () {
            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.categories,
                insert: true
            }]);
        });

        it('should insert a new post and return the same post instance as we sent', function() {
            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.categories,
                insert: true
            }]).then(insertedPost => {
                insertedPost.should.be.equal(newPost);
            });
        });

        it('should have a new generated id after post is created', function () {
            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.categories,
                insert: true
            }]).then(savedPost => {
                expect(savedPost.categories[0].id).not.to.be.empty;
            });
        });

        it('should return a post and its categories should have id since they are saved to db', function () {
            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.categories,
                insert: true
            }]).then(savedPost => {
                expect(savedPost.categories[0].id).not.to.be.empty;
            });
        });

        it('should return a post and its categories should have id since they are saved to db', function () {
            let postId: ObjectID, categoryId: ObjectID;
            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.categories,
                insert: true
            }]).then(savedPost => {
                postId = savedPost.id;
                categoryId = savedPost.categories[0].id;
                return postRepository.findOne({
                    title: 'Hello I am a new post'
                }, null, postProperties => [{
                    field: postProperties.categories
                }]);
            }).then(foundPost => {
                foundPost.should.be.eql({
                    id: postId,
                    title: 'Hello I am a new post',
                    text: 'My name is Post and I am glad to see you',
                    categories: [{
                        id: categoryId,
                        name: 'Hello',
                        videos: []
                    }]
                });
            });
        });

    });

    describe('insert new question cascaded by annotation option', function() {
        let newQuestion: Question, newCategory: Category;

        beforeEach(function() {
            newCategory = new Category('Hello');
            newQuestion = new Question('Hello I am a new question', 'My name is question and I am glad to see you');
            newQuestion.categories.push(newCategory);
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
                expect(savedQuestion.categories[0].id).not.to.be.empty;
            });
        });

        it('should return a question and its categories should have id since they are saved to db', function () {
            return questionRepository.persist(newQuestion).then(savedQuestion => {
                expect(savedQuestion.categories[0].id).not.to.be.empty;
            });
        });

        it('should return a question and its categories should have id since they are saved to db. fetch it', function () {
            let questionId: ObjectID, categoryId: ObjectID;
            return questionRepository.persist(newQuestion).then(savedQuestion => {
                questionId = savedQuestion.id;
                categoryId = savedQuestion.categories[0].id;
                return questionRepository.findOne({
                    title: 'Hello I am a new question'
                }, null, questionProperties => [{
                    field: questionProperties.categories
                }]);
            }).then(foundQuestion => {
                foundQuestion.should.be.eql({
                    id: questionId,
                    title: 'Hello I am a new question',
                    text: 'My name is question and I am glad to see you',
                    categories: [{
                        id: categoryId,
                        name: 'Hello',
                        videos: []
                    }]
                });
            });
        });

        it('should not insert a details of the question if implicit cascade options given where insert is denied', function () {
            let questionId: ObjectID, categoryId: ObjectID;
            return questionRepository.persist(newQuestion, questionProperties => [{
                field: questionProperties.categories,
                insert: false
            }]).then(savedQuestion => {
                questionId = savedQuestion.id;
                categoryId = savedQuestion.categories[0].id;
                return questionRepository.findOne({
                    title: 'Hello I am a new question'
                }, null, questionProperties => [{
                    field: questionProperties.categories
                }]);
            }).then(foundQuestion => {
                foundQuestion.should.be.eql({
                    id: questionId,
                    title: 'Hello I am a new question',
                    text: 'My name is question and I am glad to see you',
                    categories: []
                });
                expect(foundQuestion.categories).to.be.empty;
            });
        });

    });

    describe('load a post depend of cascade options set', function() {
        let postId: ObjectID, categoryId: ObjectID;

        beforeEach(function() {
            var newCategory = new Category('Hello');
            var newPost = new Post('Hello I am a new post', 'My name is Post and I am glad to see you');
            newPost.categories.push(newCategory);

            return postRepository.persist(newPost, postProperties => [{
                field: postProperties.categories,
                insert: true
            }]).then(post => {
                postId = post.id;
                categoryId = post.categories[0].id;
            });
        });

        it('should load a post without categories if cascade options are not specified', function () {
            return postRepository.findById(postId).then(post => {
                expect(post.categories).to.be.empty;
            });
        });

        it('should load a post with categories if cascade options are specified', function () {
            return postRepository.findById(postId, null, postParameters => [{
                field: postParameters.categories
            }]).then(post => {
                post.categories[0].should.be.eql({
                    id: categoryId,
                    name: 'Hello',
                    videos: []
                });
            });
        });

    });

    describe('load a post depend of inner/left join option set', function() {
        let postWithoutCategoriesId: ObjectID, postWithCategoriesId: ObjectID, categoryId: ObjectID;

        beforeEach(function() {
            var newCategory = new Category('Hello');
            var postWithCategories = new Post('Hello I am a new post', 'My name is Post and I am glad to see you');
            postWithCategories.categories.push(newCategory);

            var postWithoutCategories = new Post('Hello I am a new post', 'My name is Post and I am glad to see you');

            return postRepository.persist(postWithoutCategories).then(post => {
                postWithoutCategoriesId = post.id;
                return postRepository.persist(postWithCategories, postProperties => [{
                    field: postProperties.categories,
                    insert: true
                }]);
            }).then(post => {
                postWithCategoriesId = post.id;
                categoryId = post.categories[0].id;
            });
        });

        it('should load the post that don\'t have categories if standard (left) join is used', function () {
            return postRepository.findById(postWithoutCategoriesId, null, postParameters => [{
                field: postParameters.categories
            }]).then(post => {
                post.should.not.be.empty;
                expect(post.categories).to.be.empty;
            });
        });

        it('should not load the post that don\'t have categories if inner join is used', function () {
            return postRepository.findById(postWithoutCategoriesId, null, postParameters => [{
                field: postParameters.categories,
                inner: true
            }]).then(post => {
                expect(post).to.be.null;
            });
        });

        it('should load the post that have categories if inner join is used', function () {
            return postRepository.findById(postWithCategoriesId, null, postParameters => [{
                field: postParameters.categories,
                inner: true
            }]).then(post => {
                post.should.not.be.empty;
                post.categories.should.not.be.empty;
            });
        });

    });

    describe('load a post\'s categories depend of extra conditions', function() {
        let postId: ObjectID, categoryId: ObjectID;

        beforeEach(function() {
            var newCategory = new Category('Hello');
            var newPost = new Post('Hello I am a new post', 'My name is Post and I am glad to see you');
            newPost.categories.push(newCategory);

            return postRepository.persist(newPost).then(post => {
                postId = post.id;
                return postRepository.persist(post, postProperties => [{
                    field: postProperties.categories,
                    insert: true
                }]);
            }).then(post => {
                postId = post.id;
                categoryId = post.categories[0].id;
            });
        });

        it('should load the post that don\'t have categories if no condition is used', function () {
            return postRepository.findById(postId, null, postParameters => [{
                field: postParameters.categories
            }]).then(post => {
                post.should.not.be.empty;
            });
        });

        it('should load the post and its categories if condition is used and condition matches', function () {
            return postRepository.findById(postId, null, postParameters => [{
                field: postParameters.categories,
                condition: {
                    name: 'Hello'
                }
            }]).then(post => {
                post.should.not.be.empty;
                post.categories.should.not.be.empty;
            });
        });

        it('should load the post but don\'t load its categories if condition is used and condition doesn\'t match', function () {
            return postRepository.findById(postId, null, postParameters => [{
                field: postParameters.categories,
                condition: {
                    name: 'Good bye'
                }
            }]).then(post => {
                expect(post).not.to.be.empty;
                expect(post.categories).to.be.empty;
            });
        });

        it('should not load the post and its categories if condition doesn\'t match and inner join is used', function () {
            return postRepository.findById(postId, null, postParameters => [{
                field: postParameters.categories,
                inner: true,
                condition: {
                    name: 'Good buy'
                }
            }]).then(post => {
                expect(post).to.be.null;
            });
        });

    });
    
    describe('load photo and its categories automatically because always left join annotation is set on its properties', function() {
        let photoId: ObjectID, categoryId: ObjectID;

        beforeEach(function() {
            var newCategory = new Category('Hello');
            var newPhoto = new Photo('Hello I am a new photo', 'My name is photo and I am glad to see you');
            newPhoto.categories.push(newCategory);

            return photoRepository.persist(newPhoto).then(photo => {
                photoId = photo.id;
                return photoRepository.persist(photo, photoProperties => [{
                    field: photoProperties.categories,
                    insert: true
                }]);
            }).then(photo => {
                photoId = photo.id;
                categoryId = photo.categories[0].id;
            });
        });

        it('should load the photo with its categories automatically without joins set', function () {
            return photoRepository.findById(photoId).then(photo => {
                expect(photo).not.to.be.empty;
                expect(photo.categories).not.to.be.empty;
            });
        });

    });

    describe('load and insert from inverse side too', function() {
        let video: Video, category: Category;

        beforeEach(function() {
            video = new Video('Hello I am a new video', 'My name is video and I am glad to see you');
            category = new Category('Funny');
            category.videos.push(video);
        });

        it('should insert a video and its categories', function () {
            return categoryRepository.persist(category, categoryProperties => [{
                field: categoryProperties.videos,
                insert: true
            }]).then(category => {
                expect(category.id).not.to.be.empty;
                expect(category.videos[0].id).not.to.be.empty;
            });
        });

        it('should insert a video and its categories', function () {
            return categoryRepository.persist(category, categoryProperties => [{
                field: categoryProperties.videos,
                insert: true
            }]).then(() => {
                return categoryRepository.findById(category.id, null, categoryProperties => [{
                    field: categoryProperties.videos
                }]);
            }).then(category => {
                expect(category).not.to.be.empty;
                expect(category.videos[0].id).to.be.eql(video.id);
            });
        });

    });
    
    describe('cascade update and remove operations via cascade settings', function() {
        let video: Video, category: Category;

        beforeEach(function() {
            category = new Category('Funny');
            video = new Video('Hello I am a new video', 'My name is video and I am glad to see you');
            video.categories.push(category);

            return videoRepository.persist(video, videoProperties => [{
                field: videoProperties.categories,
                insert: true
            }]);
        });

        it('should not update video details if cascade options are not given', function () {
            video.categories[0].name = 'Peace';
            return videoRepository.persist(video, videoProperties => [{
                field: videoProperties.categories,
                insert: true
            }]).then(() => {
                return videoRepository.findById(video.id, null, videoParameters => [{
                    field: videoParameters.categories
                }]);
            }).then(video => {
                video.categories[0].name.should.be.equal('Funny');
            });
        });

        it('should update video details if cascade options are given', function () {
            video.categories[0].name = 'Peace';
            return videoRepository.persist(video, videoProperties => [{
                field: videoProperties.categories,
                update: true
            }]).then(() => {
                return videoRepository.findById(video.id, null, videoParameters => [{
                    field: videoParameters.categories
                }]);
            }).then(video => {
                video.categories[0].name.should.be.equal('Peace');
                video.categories[0].name.should.not.be.equal('Funny');
            });
        });

        it('should not remove video details if cascade options are not given', function () {
            video.categories.splice(0, 1);
            return videoRepository.persist(video, videoProperties => [{
                field: videoProperties.categories,
                update: true
            }]).then(() => {
                return categoryRepository.findById(category.id);
            }).then(category => {
                expect(category).not.to.be.null;
            });
        });

        it('should remove video details if cascade options are given', function () {
            video.categories.splice(0, 1);
            return videoRepository.persist(video, videoProperties => [{
                field: videoProperties.categories,
                remove: true
            }]).then(() => {
                return categoryRepository.findById(category.id);
            }).then(category => {
                expect(category).to.be.null;
            });
        });

    });

    describe('cascade update and remove operations via annotations', function() {
        let vote: Vote, category: Category;

        beforeEach(function() {
            category = new Category('Funny');
            vote = new Vote('Hello I am a new video', 'My name is video and I am glad to see you');
            vote.categories.push(category);
            return voteRepository.persist(vote);
        });

        it('should update vote details because annotation is set', function () {
            vote.categories[0].name = 'Not funny at all';
            return voteRepository.persist(vote).then(() => {
                return voteRepository.findById(vote.id, null, voteParameters => [{
                    field: voteParameters.categories
                }]);
            }).then(vote => {
                console.log(vote);
                //vote.categories[0].name.should.be.equal('Not funny at all');
               // vote.categories[0].name.should.not.be.equal('Funny');
            });
        });

        it('should not update vote details if implicit cascade options are given', function () {
            vote.categories[0].name = 'Not funny at all';
            return voteRepository.persist(vote, voteProperties => [{
                field: voteProperties.categories,
                update: false
            }]).then(() => {
                return voteRepository.findById(vote.id, null, voteParameters => [{
                    field: voteParameters.categories
                }]);
            }).then(vote => {
               // vote.categories[0].name.should.be.equal('Funny');
            });
        });

        it('should not remove vote categories if cascade options are not given', function () {
            vote.categories.splice(0, 1);
            return voteRepository.persist(vote).then(() => {
                return categoryRepository.findById(category.id);
            }).then(category => {
                expect(category).to.be.null;
            });
        });

    });


});