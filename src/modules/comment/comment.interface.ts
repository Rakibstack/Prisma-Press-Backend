import { CommentStatus } from "../../../generated/prisma/enums";


  export interface IcreateCommentPayload {
     
     postId : string;
     content : string
  }

  export interface IupdateComment {

    content ?: string;
    status  ?: CommentStatus
  }