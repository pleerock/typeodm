import {Service} from "typedi/Decorators";
import {OdmRepository} from "../../src/decorator/OdmDecorators";
import {Repository} from "../../src/repository/Repository";
import {Post} from "./document/Post";
import {PostManager} from "./PostManager";

@Service()
export class PostController {

    constructor(private postManager: PostManager) {
    }

    action() {
        // create a new post
        let post = new Post();
        post.title = "Hello I am a new post";
        post.text = "My name is Post and I am glad to see you";

        // save a post
        this.postManager.save(post).then(savedPost => {
            console.log("Post saved successfully: ");
            console.log(savedPost);

        }).catch(error => console.log("Error: " + error));
    }

}