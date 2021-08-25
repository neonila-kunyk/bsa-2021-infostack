import { Hit } from '@elastic/elasticsearch/api/types';

import { IElasticPageContent } from '../../../elasticsearch';
import { IFoundPageContent } from '../../interfaces/page';

const mapSearchHitElasticPageContentToFoundPageContent = (
  hits: Hit<IElasticPageContent>[],
): IFoundPageContent[] => {
  return hits.map(({ highlight, _source }) => {
    return {
      id: _source.pageId,
      pageId: _source.pageId,
      title: highlight?.title?.[0] || _source.title,
      content: highlight?.content?.[0] || _source.content,
    };
  });
};

export default mapSearchHitElasticPageContentToFoundPageContent;
