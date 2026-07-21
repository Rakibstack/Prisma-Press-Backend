import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";


export interface IcreatePostPayload {

    title : string;
    content: string;
    thumbnail ?: string;
    isFeatured?: boolean;
    isPremium? : boolean;
    status?: PostStatus;
    tags : string[];
}

 export interface IupdatePostPayload {

     title?: string;
    content?: string;
    thumbnail ?: string;
    isFeatured?: boolean;
    status?: PostStatus;
    tags?: string[];
 }

  export interface IpostQuery extends PostWhereInput {
  
    searchTerm ?: string;
    page ?: string;
    limit ? : string;
    sortOrder?: string;
    sortBy ? : string; 

  }