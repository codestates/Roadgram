export class CreateCommentDto {
  loginMethod: number;
  userId: number;
  articleId: number;
  comment: string;
}

export class ModifyCommentDto {
  loginMethod: number;
  commentId: number;
  comment: string;
}
