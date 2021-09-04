import { http } from 'services';
import { IPageNav, IFoundPageContent } from 'common/interfaces';

class PageService {
  private readonly _http = http;
  private readonly _BASE = 'http://10.0.2.2:3001/api/pages';

  getAll(): Promise<IPageNav[]> {
    return this._http.load(this._BASE);
  }

  searchContent(query: string): Promise<IFoundPageContent[]> {
    return this._http.load(`${this._BASE}/search?query=${query}`);
  }
}

export const pageService = new PageService();
