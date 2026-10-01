import { CommentWithAuthor } from '@/types/blog.type';
import CommentCard from './CommentCard';

type Props = {
  userId?: string;
  postId: string;
  comments: CommentWithAuthor[];
  commentsByParentId: Record<string, CommentWithAuthor[]>;
};

const CommentsList = ({ userId, postId, comments, commentsByParentId }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {comments.map(comment => (
        <CommentCard
          postId={postId}
          key={comment.id}
          userId={userId}
          comment={comment}
          commentsByParentId={commentsByParentId}
        />
      ))}
    </div>
  );
};

export default CommentsList;
