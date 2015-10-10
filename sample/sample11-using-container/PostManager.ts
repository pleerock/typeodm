import {Resolve} from "typedi/Resolve";
import {OdmRepository} from "../../src/annotation/OdmRepository";
import {Repository} from "../../src/repository/Repository";
import {Post} from "./document/Post";

@Resolve()
export class PostManager {

    constructor(@OdmRepository(Post) private repository: Repository<Post>) {
    }

    save(post: Post): Promise<Post> {
        return this.repository.persist(post);
    }

}