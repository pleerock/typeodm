import * as chai from "chai";
import {expect} from "chai";
import {OdmFactory} from "../../../src/OdmFactory";
import {Connection} from "../../../src/connection/Connection";
import {Repository} from "../../../src/repository/Repository";
import {Post} from "../../../sample/sample4-embedded-documents/document/Post";
import {PostTag} from "../../../sample/sample4-embedded-documents/document/PostTag";
import {PostAuthor} from "../../../sample/sample4-embedded-documents/document/PostAuthor";
import {ObjectID} from "mongodb";

chai.should();
describe("sample4-embedded-documents", function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    // connect to db
    let connection: Connection;
    before(function() {
        return OdmFactory.createMongodbConnection("mongodb://localhost:27017/testdb", [__dirname + "/../../../sample/sample4-embedded-documents/document"]).then(conn => {
            connection = conn;
        }).catch(e => console.log("Error during connection to mongodb: " + e));
    });

    after(function() {
        connection.close();
    });

    // drop database before each test
    beforeEach(function() {
        return connection.driver.dropDatabase();
    });

    let postRepository: Repository<Post>;
    beforeEach(function() {
        postRepository = connection.getRepository<Post>(Post);
    });

    // -------------------------------------------------------------------------
    // Specifications: persist
    // -------------------------------------------------------------------------

    describe("persist with embedded documents functionality", function() {
        let newPost: Post;

        beforeEach(function() {
            let author = new PostAuthor();
            author.firstName = "David";
            author.lastName = "Superman";

            let firstTag = new PostTag();
            firstTag.name = "technologies";
            firstTag.description = "Everything about new technologies";

            let secondTag = new PostTag();
            secondTag.name = "programming";
            secondTag.description = "Everything about programming";

            newPost = new Post();
            newPost.title = "New version of odm is available";
            newPost.text  = "See details on our site";
            newPost.author = author;
            newPost.tags = [firstTag, secondTag];
        });

        it("should successfully insert a new post", function () {
            return postRepository.persist(newPost);
        });

        it("should insert a new post and return the same post instance as we sent", function() {
            return postRepository.persist(newPost).then(insertedPost => {
                insertedPost.should.be.equal(newPost);
            });
        });

        it("should have a new generated id after post is created", function () {
            return postRepository.persist(newPost).then(savedPost => {
                expect(savedPost.id).not.to.be.empty;
            });
        });

        it("should insert a post and it should exist in db", function () {
            let id: ObjectID, authorId: ObjectID;
            return postRepository.persist(newPost).then(savedPost => {
                id = savedPost.id;
                authorId = savedPost.author.id;
                return postRepository.findOne({
                    title: "New version of odm is available"
                });
            }).then(foundPost => {
                foundPost.should.be.eql({
                    id: id,
                    title: "New version of odm is available",
                    text: "See details on our site",
                    author: {
                        id: authorId,
                        firstName: "David",
                        lastName: "Superman"
                    },
                    links: [],
                    tags: [{
                        name: "technologies",
                        description: "Everything about new technologies"
                    }, {
                        name: "programming",
                        description: "Everything about programming"
                    }]
                });
            });
        });


    });

});