import { EntityRepository, Repository } from 'typeorm';
import { UserPermission } from '../entities/user-permission';
import { User } from '../entities/user';
import { Page } from '../entities/page';
import { PermissionType } from '../../common/enums/permission-type';

@EntityRepository(UserPermission)
class UserPermissionRepository extends Repository<UserPermission> {

  public createAndSave(user: User, page: Page, option: PermissionType): Promise<UserPermission> {
    const userPermission = this.create({
      user,
      page,
      option,
    });

    return this.manager.save(userPermission);
  }

  public findByUserId(
    userId: string,
  ): Promise<UserPermission[]> {
    return this.find({
      relations: ['page'],
      where: { user: userId },
    });
  }

  public findByPageId(
    pageId: string,
  ): Promise<UserPermission[]> {
    return this.find({
      relations: ['user'],
      where: { page: pageId },
    });
  }

  public findByUserAndPageId(
    userId: string,
    pageId: string,
  ): Promise<UserPermission[]> {
    return this.find({
      relations: ['user', 'page'],
      where: { user: userId, page: pageId },
    });
  }
}

export default UserPermissionRepository;
