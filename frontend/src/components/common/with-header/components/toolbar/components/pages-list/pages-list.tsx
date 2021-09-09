import { PageItem } from '..';
import { IPageNav } from 'common/interfaces';

type Props = {
  pages: IPageNav[] | null;
  allowSubPageAdd: boolean;
  allowRemoveAction: boolean;
};

export const PagesList: React.FC<Props> = ({
  pages,
  allowSubPageAdd,
  allowRemoveAction,
}) => {
  return (
    <>
      {pages &&
        pages.map(({ title, id, childPages }) => (
          <PageItem
            id={id}
            key={id}
            title={title}
            allowSubPageAdd={allowSubPageAdd}
            allowRemoveAction={allowRemoveAction}
            childPages={childPages}
          />
        ))}
    </>
  );
};
