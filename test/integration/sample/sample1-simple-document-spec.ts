import * as chai from "chai";
import {expect} from "chai";
import {OdmFactory} from "../../../src/OdmFactory";
import {Connection} from "../../../src/connection/Connection";
import {Post} from "../../../sample/sample1-simple-document/document/Post";
import {Repository} from "../../../src/repository/Repository";

chai.should();
describe('sample1-simple-document', function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    // connect to db
    let connection: Connection;
    before(function() {
        return OdmFactory.createMongodbConnection('mongodb://localhost:27017/testdb', [__dirname + '/../../../sample/sample1-simple-document/document']).then(conn => {
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

    let postRepository:Repository<Post>;
    beforeEach(function() {
        postRepository = connection.getRepository<Post>(Post);
    });

    // -------------------------------------------------------------------------
    // Specifications: create
    // -------------------------------------------------------------------------

    describe('create', function() {
        it('should return a new Post object', function () {
            return postRepository.create().should.be.instanceOf(Post);
        });
    });

    // -------------------------------------------------------------------------
    // Specifications: persist
    // -------------------------------------------------------------------------

    describe('basic insert functionality', function() {
        let newPost: Post;

        beforeEach(function() {
            newPost = new Post();
            newPost.title = 'New version of odm is available';
            newPost.text  = 'See details on our site';
        });

        it('should successfully insert a new post', function () {
            return postRepository.persist(newPost);
        });

        it('should return the same post instance after its created', function () {
            return postRepository.persist(newPost).then(savedPost => {
                savedPost.should.be.equal(newPost);
            });
        });

        it('should have a new generated id after post is created', function () {
            return postRepository.persist(newPost).then(savedPost => {
                expect(savedPost.id).not.to.be.empty;
            });
        });

        it('should insert a post and it should exist in db', function () {
            let id: string;
            return postRepository.persist(newPost).then(savedPost => {
                id = savedPost.id;
                return postRepository.findOne({
                    title: 'New version of odm is available'
                });
            }).then(foundPost => {
                foundPost.should.be.eql({
                    id: id,
                    title: 'New version of odm is available',
                    text: 'See details on our site'
                });
            });
        });

    });

});