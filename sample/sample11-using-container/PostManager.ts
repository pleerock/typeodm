import {Service} from "typedi/Decorators";
import {OdmRepository} from "../../src/decorator/OdmDecorators";
import {Repository} from "../../src/repository/Repository";
import {Post} from "./document/Post";

@Service()
export class PostManager {

    constructor(@OdmRepository(Post) private repository: Repository<Post>) {
    }

    save(post: Post): Promise<Post> {
        return this.repository.persist(post);
    }

}