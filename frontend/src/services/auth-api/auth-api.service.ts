import { IRefreshToken, ILogin, IRegister } from 'common/interfaces/auth';
import { IUserWithTokens } from 'common/interfaces/user';
import { HttpMethod, ContentType } from 'common/enums/enums';
import { IResetPassword, ISetPassword } from 'common/interfaces/auth';
import { http } from 'services/http/http.service';

class AuthApi {
  private http = http;
  private BASE = '/api/auth';

  public async loginUser(
    loginPayload: ILogin,
  ): Promise<IUserWithTokens> {
    const loginResponse: IUserWithTokens = await this.http.load(`${this.BASE}/login`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(loginPayload),
      contentType: ContentType.JSON,
    });

    return loginResponse;
  }

  public async registerUser(
    registerPayload: IRegister,
  ): Promise<IUserWithTokens> {
    const registerResponse: IUserWithTokens = await this.http.load(
      `${this.BASE}/register`,
      {
        method: HttpMethod.POST,
        payload: JSON.stringify(registerPayload),
        contentType: ContentType.JSON,
      },
    );

    return registerResponse;
  }

  public async resetPassword(payload: IResetPassword): Promise<void> {
    return this.http.load(`${this.BASE}/reset-password`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      contentType: ContentType.JSON,
    });
  }

  public async setPassword(payload: ISetPassword): Promise<void> {
    return this.http.load(`${this.BASE}/set-password`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      contentType: ContentType.JSON,
    });
  }

  public async logout(payload: IRefreshToken): Promise<void> {
    return this.http.load(`${this.BASE}/logout`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      contentType: ContentType.JSON,
    });
  }
}

export { AuthApi };
