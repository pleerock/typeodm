import * as chai from "chai";
import {expect} from "chai";
import {OdmFactory} from "../../../src/OdmFactory";
import {Connection} from "../../../src/connection/Connection";
import {Post} from "../../../sample/sample2-custom-document-name/document/Post";
import {Repository} from "../../../src/repository/Repository";

chai.should();
describe('sample2-custom-document-name', function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    // connect to db
    let connection: Connection;
    before(function() {
        return OdmFactory.createMongodbConnection('mongodb://localhost:27017/testdb', [__dirname + '/../../../sample/sample2-custom-document-name/document']).then(conn => {
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
                    title_name: 'New version of odm is available'
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