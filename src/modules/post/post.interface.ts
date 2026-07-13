import { PostStatus } from "../../../generated/prisma/enums";


export interface IcreatePostPayload {

    title : string;
    content: string;
    thumbnail ?: string;
    isFeatured?: boolean;
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