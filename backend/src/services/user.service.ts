import UserRepository from '../data/repositories/user.repository';
import UserWorkspaceRepository from '../data/repositories/user-workspace.repository';
import { getCustomRepository } from 'typeorm';
import {
  deleteFile,
  isFileExists,
  uploadFile,
} from '../common/helpers/s3-file-storage.helper';
import { unlinkFile } from '../common/helpers/multer.helper';
import { IUser } from 'infostack-shared';

export const getUserById = async (id: string): Promise<IUser> => {
  const userRepository = getCustomRepository(UserRepository);
  const { fullName, email, avatar } = await userRepository.findById(id);

  return { id, fullName, email, avatar };
};

export const getUserByIdWithWorkspace = async (
  userId: string,
  workspaceId: string,
): Promise<IUser | null> => {
  const userRepository = getCustomRepository(UserRepository);
  const { fullName, email, avatar } = await userRepository.findById(userId);

  const userWorkspaceRepository = getCustomRepository(UserWorkspaceRepository);
  const usersWorkspaces = await userWorkspaceRepository.findUserWorkspaces(
    userId,
  );
  const workspaces = usersWorkspaces.map((userWorkspace) => {
    const workspace = userWorkspace.workspace;
    return {
      id: workspace.id,
      title: workspace.name,
    };
  });

  let permission = false;
  workspaces.map((workspace) =>
    workspace.id === workspaceId ? (permission = true) : null,
  );
  if (permission) {
    return { id: userId, fullName, email, avatar };
  } else {
    return { id: '', fullName: '', email: '', avatar: '' };
  }
};

export const updateFullName = async (
  id: string,
  body: { fullName: string },
): Promise<IUser> => {
  const userRepository = getCustomRepository(UserRepository);
  const userToUpdate = await userRepository.findById(id);

  userToUpdate.fullName = body.fullName || userToUpdate.fullName;

  const { fullName, email, avatar } = await userRepository.save(userToUpdate);
  return { id, fullName, email, avatar };
};

export const updateAvatar = async (
  id: string,
  file: Express.Multer.File,
): Promise<IUser> => {
  const userRepository = getCustomRepository(UserRepository);
  const userToUpdate = await userRepository.findById(id);
  const fileName = userToUpdate.avatar.split('/').pop();
  const isExistsAvatar = await isFileExists(fileName);

  if (isExistsAvatar) {
    deleteFile(userToUpdate.avatar);
  }

  const uploadedFile = await uploadFile(file);
  unlinkFile(file.path);
  const { Location } = uploadedFile;

  userToUpdate.avatar = Location || userToUpdate.avatar;

  const { fullName, email, avatar } = await userRepository.save(userToUpdate);
  return { id, fullName, email, avatar };
};
