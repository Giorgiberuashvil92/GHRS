import { apiRequest } from '../config/api';

export interface Comment {
  _id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  articleId: string;
  content: string;
}

// Fetch comments for an article
export async function getArticleComments(articleId: string): Promise<Comment[]> {
  return apiRequest<Comment[]>(`/api/articles/${articleId}/comments`);
}

// Create a new comment (requires authentication)
export async function createComment(data: CreateCommentData): Promise<Comment> {
  return apiRequest<Comment>(`/api/articles/${data.articleId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content: data.content }),
  });
}

// Delete a comment (requires authentication)
export async function deleteComment(commentId: string): Promise<void> {
  return apiRequest<void>(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });
}

// Like a comment
export async function likeComment(commentId: string): Promise<Comment> {
  return apiRequest<Comment>(`/api/comments/${commentId}/like`, {
    method: 'POST',
  });
}
