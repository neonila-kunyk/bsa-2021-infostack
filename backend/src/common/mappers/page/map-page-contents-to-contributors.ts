import { Page } from '../../../data/entities';
import { IPageContributor } from '../../interfaces';

export const mapPageToContributors = ({
  pageContents,
}: Page): IPageContributor[] => {
  const contributors: Record<string, IPageContributor> = {};

  for (const pageContent of pageContents) {
    const { id, fullName, avatar } = pageContent.author;

    if (!contributors[id]) {
      contributors[id] = {
        id,
        fullName,
        avatar,
      };
    }
  }

  return Object.values(contributors);
};
