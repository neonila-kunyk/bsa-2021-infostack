enum AppRoute {
  ROOT = '/',
  LOGIN = '/login',
  LOGIN_GOOGLE = '/login-google',
  SIGN_UP = '/signup',
  INVITE = '/invite',
  RESET_PASSWORD = '/reset-password',
  SET_PASSWORD = '/set-password',
  WORKSPACES = '/workspaces',
  PAGE = '/page/:id',
  PROFILE = '/users/profile/:id',
  SETTINGS = '/settings',
  SETTINGS_PROFILE = '/settings/profile',
  SETTINGS_USERS = '/settings/users',
  SETTINGS_TAGS = '/settings/tags',
  WORKSPACE_SETTING = '/workspace/settings',
  CONTENT_SETTING = '/page/:id/editor',
  SETTINGS_TEAMS = '/settings/teams',
}

export { AppRoute };
