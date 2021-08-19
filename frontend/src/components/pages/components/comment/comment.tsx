import { ListGroup } from 'react-bootstrap';
import { useState, useHistory, useAppSelector } from 'hooks/hooks';
import { replaceIdParam } from 'helpers/helpers';
import { AppRoute } from 'common/enums/enums';
import { CommentForm } from '../components';
import { Emoji } from '../emoji/emoji';
import { UserAvatar } from 'components/common/common';
import { commentsSelectors } from 'store/comments/slice';
import { ICommentNormalized } from 'common/interfaces/comment';
import { TimeAgo } from 'components/common/time-ago/time-ago';
import styles from './styles.module.scss';

type Props = {
  id: string;
  handleDelete: (id: string) => void;
};

export const Comment: React.FC<Props> = ({ id, handleDelete }) => {
  const comment = useAppSelector((state) =>
    commentsSelectors.selectById(state, id),
  ) as ICommentNormalized;
  const user = useAppSelector((state) => state.auth.user);

  const {
    text,
    pageId,
    children,
    createdAt,
    author: { id: authorId, fullName: name, avatar },
    reactions,
  } = comment;

  const [isFieldVisible, setIsFieldVisible] = useState<boolean>(false);
  const history = useHistory();

  const toggleField = (): void => setIsFieldVisible((prev) => !prev);

  const handleAvatarClick = (userId?: string): void => {
    if (!userId) {
      return;
    }

    history.push(replaceIdParam(AppRoute.PROFILE, userId));
  };

  const isOwnComment = user?.id === authorId;

  return (
    <div className={styles.comment}>
      <UserAvatar
        size="40"
        name={name}
        src={avatar}
        round
        className={styles.avatar}
        onClick={(): void => handleAvatarClick(authorId)}
      />
      <div className={styles.content}>
        <span className={styles.author}>{name}</span>
        <span className={styles.metadata}>
          <TimeAgo timestamp={createdAt} />
        </span>
        <div className={styles.text}>{text}</div>
        <Emoji reactions={reactions} commentId={id} />
        <div className={styles.actions}>
          <a className={styles.action} onClick={toggleField}>
            reply
          </a>{' '}
          {isOwnComment && (
            <a className={styles.action} onClick={(): void => handleDelete(id)}>
              delete
            </a>
          )}
        </div>
        {isFieldVisible && (
          <CommentForm
            pageId={pageId}
            parentCommentId={id}
            className="mt-2"
            placeholder="Add a reply"
            onSubmit={toggleField}
            onCancel={toggleField}
          />
        )}
        {children && (
          <ListGroup variant="flush" className="w-100 mw-100">
            {children.map((id) => (
              <Comment key={id} id={id} handleDelete={handleDelete} />
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
};
