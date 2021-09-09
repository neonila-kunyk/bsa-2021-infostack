import { Router } from 'express';

import { run } from '../../common/helpers';
import {
  getNotifications,
  getNotificationsCount,
  updateRead,
  updateReadForAll,
} from '../../services/notification.service';

const router: Router = Router();

router.get(
  '/',
  run((req) =>
    getNotifications(
      req.userId,
      req.workspaceId,
      req.query.take,
      req.query.skip,
    ),
  ),
);

router.get(
  '/count',
  run((req) => getNotificationsCount(req.userId, req.workspaceId)),
);

router.put(
  '/:id',
  run((req) => updateRead(req.params.id, req.body)),
);

router.put(
  '/',
  run((req) => updateReadForAll(req.userId, req.workspaceId, req.body)),
);

export default router;
