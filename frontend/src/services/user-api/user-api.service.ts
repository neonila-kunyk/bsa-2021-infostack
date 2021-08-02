import { IUser, IUserWithTokens } from 'common/interfaces/user';
import { HttpMethod, ContentType } from 'common/enums/enums';
import { Http } from 'services/http/http.service';

const http = new Http();

class UserApi {
  public async getCurrentUserId(): Promise<{ userId: string }> {
    return await http.load('/api/users/id');
  }

  public async getInfo(
    id: string,
  ): Promise<IUserWithTokens> {
    return await http.load(`/api/users/${id}/profile`);
  }

  public async update(
    id: string,
    updatePayload: Partial<IUser>,
  ): Promise<IUser> {
    const updateResponse: IUser = await http.load(`/api/users/${id}/profile`, {
      method: HttpMethod.PUT,
      payload: JSON.stringify(updatePayload),
      contentType: ContentType.JSON,
    });

    return updateResponse;
  }

  public async uploadAvatar(
    id: string,
    file: File,
    fileName: string,
  ): Promise<IUser> {
    const fd = new FormData();
    fd.append('image', file, fileName);

    const uploadResponse: IUser = await http.load(`/api/users/${id}/avatar`, {
      method: HttpMethod.PUT,
      payload: fd,
    });

    return uploadResponse;
  }
}

export { UserApi };
