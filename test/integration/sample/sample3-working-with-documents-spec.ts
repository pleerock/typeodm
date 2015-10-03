import * as chai from "chai";
import {OdmFactory} from "../../../src/OdmFactory";
import {Connection} from "../../../src/connection/Connection";
import {Post} from "../../../sample/sample3-working-with-documents/document/Post";
import {Repository} from "../../../src/repository/Repository";

chai.should();
describe('sample3-working-with-documents', function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    // connect to db
    let connection: Connection;
    before(function() {
        return OdmFactory.createMongodbConnection('mongodb://localhost:27017/testdb', [__dirname + '/../../../sample/sample3-working-with-documents/document']).then(conn => {
            connection = conn;
        }).catch(e => console.log('Error during connection to mongodb: ' + e));
    });

    // drop database before each test
    beforeEach(function() {
        return connection.driver.drop();
    });

    let postRepository:Repository<Post>;
    beforeEach(function() {
        postRepository = connection.getRepository<Post>(Post);
    });

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    describe('basic update functionality', function() {
        let insertedPost: Post;

        beforeEach(function() {
            let newPost = new Post();
            newPost.title = 'New version of odm is available';
            newPost.text  = 'See details on our site';
            return postRepository.persist(newPost).then(post => {
                insertedPost = post;
            });
        });

        it('should successfully update a post', function () {
            insertedPost.title = 'Change title!';
            insertedPost.text = 'I have changed title and text of the post';
            return postRepository.persist(insertedPost);
        });

        it('should return updated post instance after update', function() {
            insertedPost.title = 'Change title!';
            insertedPost.text = 'I have changed title and text of the post';
            return postRepository.persist(insertedPost).then(updatePost => {
                updatePost.should.be.equal(insertedPost);
            });
        });

        it('should update a post in db', function() {
            insertedPost.title = 'Change title!';
            insertedPost.text = 'I have changed title and text of the post';
            return postRepository.persist(insertedPost).then(() => {
                return postRepository.findOne({ title: 'Change title!' });

            }).then((foundUpdatedPost: Post) => {
                foundUpdatedPost.should.not.be.equal(insertedPost);
                foundUpdatedPost.should.be.eql({
                    id: insertedPost.id,
                    title: 'Change title!',
                    text: 'I have changed title and text of the post'
                });
            });
        });

    });

    describe('basic remove functionality', function() {
        let insertedPost: Post;

        beforeEach(function() {
            let newPost = new Post();
            newPost.title = 'New version of odm is available';
            newPost.text  = 'See details on our site';
            return postRepository.persist(newPost).then(post => {
                insertedPost = post;
            });
        });

        it('should successfully remove a post', function () {
            return postRepository.remove(insertedPost);
        });

        it('should not find a post in the database after removal', function () {
            return postRepository.remove(insertedPost).then(() => {
                return postRepository.find({ title: 'New version of odm is available' });
            }).then(posts => {
                posts.should.be.empty;
            });
        });

    });

});