import {OdmFactory} from "../../src/OdmFactory";
import {Post} from "./document/Post";
import {PostAuthor} from "./document/PostAuthor";
import {PostTag} from "./document/PostTag";

/**
 * This sample is focused to teach on how to:
 *  - create a document instances from given raw json data
 * */

OdmFactory.createMongodbConnection("mongodb://localhost:27017/typeodm-samples", [__dirname + "/document"]).then(connection => {
    console.log("Connection to mongodb is established");

    let postJson: any = {
        title: "New Intel processors are released",
        text: "Today Intel announced a new processors line",
        author: {
            firstName: "Bek",
            lastName: "Zukov"
        },
        details: {
            searchKeywords: "zukov,intel,processors",
            searchDescription: "intel processors"
        }
    };

    let updatedPostJson: any = {
        title: "Old Intel processors are released",
        text: "Today Intel announced a old processors line",
        author: {
            firstName: "Bek",
            lastName: "Shukurov"
        },
        details: {
            searchKeywords: "shukurov,intel,processors",
            searchDescription: "intel processors"
        }
    };

    // get a post repository
    let postRepository = connection.getRepository<Post>(Post);

    return postRepository.initialize(postJson).then(post => {
        console.log("Post initialized: ");
        console.log(post.getTitleLowerCased());
        console.log("Now lets save this post: ");

        return postRepository.persist(post);

    }).then(savedPost => {
        console.log("New post is saved. Its id:", savedPost.id);
        console.log("New details are saved. Id:", savedPost.details.id);

        updatedPostJson.id = savedPost.id;
        updatedPostJson.details.id = savedPost.details.id;
        return postRepository.initialize(updatedPostJson);

    }).then(post => {
        console.log("Updated post initialized: ");
        console.log(post);
        console.log(post.getTitleLowerCased());
        console.log("Now lets update this post: ");

        return postRepository.persist(post);

    }).then(updatedPost => {
        console.log("Post is updated: ", updatedPost);

    }).catch(error => console.log("Error: " + error));

}).catch(e => console.log("Error during connection to mongodb: " + e));