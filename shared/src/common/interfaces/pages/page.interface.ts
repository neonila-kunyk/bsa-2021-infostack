import { IPageContent } from './page-content.interface';

interface IPage {
  id: string;
  authorId: string;
  parentPageId?: string;
  childPages?: IPage[];
  pageContents: IPageContent[];
}

export type { IPage };
