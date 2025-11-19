import { PostRepository } from "@/models/post/post-models";
import { PostModel } from "./post-models";
import { resolve } from "path";

const ROOT_DIR = process.cwd();//raiz do site
const JSON_POST_FILE_PATH = resolve(ROOT_DIR,'src','db','seed','post.json')

export class JsonPostRepository implements PostRepository{

  private async readFromDisk(){

  }

  async findAll(): Promise<PostModel[]> {

  }
}

export const PostRepository = new JsonPostRepository();


console.log(JSON_POST_FILE_PATH);
