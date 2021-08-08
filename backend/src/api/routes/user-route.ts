import { Router } from 'express';
import { upload } from '../../common/helpers/multer.helper';
import { run } from '../../common/helpers/route.helper';
import { getUserWorkspaces } from '../../services/workspace.service';
import {
  getUserById,
  updateFullName,
  updateAvatar,
  getUserByIdWithWorkspace,
} from '../../services/user.service';

const router: Router = Router();

router
  .get('/me/profile', run((req) => getUserById(req.userId)))
  .get('/:id/profile', run((req) => getUserByIdWithWorkspace(req.params.id, req.workspaceId)))
  .get('/:id/workspaces', run((req) => getUserWorkspaces(req.params.id)))
  .put('/:id/profile', run((req) => updateFullName(req.params.id, req.body)))
  .put('/:id/avatar', upload().single('image'), run((req) => updateAvatar(req.params.id, req.file)));

export default router;
