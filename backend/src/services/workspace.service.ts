import { getCustomRepository } from 'typeorm';
import { IWorkspaceUser } from '../common/interfaces/workspace/workspace-user';
import { IWorkspace } from '../common/interfaces/workspace/workspace';
import { IWorkspaceCreation } from '../common/interfaces/workspace/workspace-creation';
import { mapWorkspaceToWorkspaceUsers } from '../common/mappers/workspace/map-workspace-to-workspace-users';
import WorkspaceRepository from '../data/repositories/workspace.repository';
import UserWorkspaceRepository from '../data/repositories/user-workspace.repository';
import UserRepository from '../data/repositories/user.repository';
import { RoleType } from '../common/enums/role-type';
// import { InviteStatus } from '../common/enums/invite-status';
import { IWorkspaceUserRole } from '../common/interfaces/workspace/workspace-user-role';
import { HttpError } from '../common/errors/http-error';
import { HttpCode } from '../common/enums/http-code';
import { HttpErrorMessage } from '../common/enums/http-error-message';
import { sendMail } from '../common/utils/mailer.util';
import { IRegister } from 'infostack-shared';
import { generateAccessToken } from '../common/utils/tokens.util';
import { env } from '../env';
import { hash } from '../common/utils/hash.util';

export const inviteToWorkspace = async (body: IRegister, workspaceId: string): Promise<void> => {

  const userRepository = getCustomRepository(UserRepository);
  // взять email из формы введённой и найти юзера
  // eslint-disable-next-line no-console
  console.log('inviteToWorkspace body', body, 'workspaceId', workspaceId);
  const user = await userRepository.findByEmail(body.email);
  const { app } = env;
  const workspaceToken = generateAccessToken(workspaceId);

  if (!user) {
    // eslint-disable-next-line no-console
    console.log('NO USER WITH THIS EMAIL');
    body.password = 'default';
    body.fullName = 'Waiting for register';
    const hashedPassword = await hash(body.password);
    const { password, ...user } = await userRepository.save({
      ...body,
      password: hashedPassword,
    });
    // const tokens = await setTokens(user);
    // eslint-disable-next-line no-console
    console.log('inviteToWorkspace created user', user);
    const userIdToken = generateAccessToken(user.id);
    const url = `${app.url}/invite?userId=${userIdToken}?worspaceId=${workspaceToken}`;

    await sendMail({ to: user.email, subject: 'You have been invited to the Infostack Workspace. Registration Link', text: url });
  } else {

    const userIdToken = generateAccessToken(user.id);
    const url = `${app.url}/invite?userId=${userIdToken}?worspaceId=${workspaceToken}`;

    await sendMail({ to: user.email, subject: 'You have been invited to the Infostack Workspace', text: url });
  }

  // права добавить на workspace, и поставить ему статус Pending
};

export const getWorkspaceUsers = async (
  workspaceId: string,
): Promise<IWorkspaceUser[]> => {
  const workspaceRepository = getCustomRepository(WorkspaceRepository);
  const workspace = await workspaceRepository.findByIdWithUsers(workspaceId);
  return mapWorkspaceToWorkspaceUsers(workspace);
};

export const getWorkspaceUserRole = async (
  userId: string,
  workspaceId: string,
): Promise<IWorkspaceUserRole> => {
  const userWorkspaceRepository = getCustomRepository(UserWorkspaceRepository);
  const userWorkspace =
    await userWorkspaceRepository.findByUserIdAndWorkspaceId(
      userId,
      workspaceId,
    );

  return { role: userWorkspace.role };
};

export const getOne = async (workspaceId: string, userId: string): Promise<IWorkspace> => {
  const userWorkspace = await getCustomRepository(UserWorkspaceRepository)
    .findByUserIdAndWorkspaceIdDetailed(userId, workspaceId);

  const workspace = userWorkspace.workspace;
  return { id: workspace.id, title: workspace.name };
};

export const getUserWorkspaces = async (userId: string): Promise<IWorkspace[]> => {
  const userWorkspaceRepository = getCustomRepository(UserWorkspaceRepository);
  const usersWorkspaces = await userWorkspaceRepository.findUserWorkspaces(
    userId,
  );
  const workspaces = [] as IWorkspace[];
  for (const userWorkspace of usersWorkspaces) {
    const workspace = userWorkspace.workspace;
    // eslint-disable-next-line no-console
    console.log(workspace);

    workspaces.push({ id: workspace.id, title: workspace.name });
  }
  return workspaces;
};

export const create = async (
  userId: string,
  data: IWorkspaceCreation,
): Promise<IWorkspace> => {
  const workspaceRepository = getCustomRepository(WorkspaceRepository);
  const userWorkspaceRepository = getCustomRepository(UserWorkspaceRepository);
  const userRepository = getCustomRepository(UserRepository);
  const isTitleUsed = await workspaceRepository.findByName(data.title);
  if (isTitleUsed) {
    throw new HttpError({
      status: HttpCode.CONFLICT,
      message: HttpErrorMessage.WORKSPACE_ALREADY_EXISTS,
    });
  }

  const user = await userRepository.findById(userId);
  const workspace = workspaceRepository.create({ name: data.title });
  await workspaceRepository.save(workspace);
  const userWorkspace = userWorkspaceRepository.create({
    user,
    workspace,
    role: RoleType.ADMIN,
    // status: InviteStatus.JOINED,
  });
  await userWorkspaceRepository.save(userWorkspace);
  return { id: workspace.id, title: workspace.name };
};
