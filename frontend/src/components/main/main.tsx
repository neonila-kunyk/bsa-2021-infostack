import { AppRoute, CookieVariable } from 'common/enums/enums';
import { Switch } from 'components/common/common';
import ProtectedRoute from 'components/common/protected-route/protected-route';
import Header from 'components/header/header';
import Toolbar from 'components/toolbar/toolbar';
import Pages from 'components/pages/pages';
import Profile from 'components/profile/profile';
import ProfileInfo from 'components/profile-info/profile-info';
import Workspace from 'components/workspace/workspace';
import styles from './styles.module.scss';
import Settings from 'components/settings/settings';
import ContentEditor from 'components/pages/components/editor/editor';
import { useAppSelector, useAppDispatch, useHistory, useCookies } from 'hooks/hooks';
import { workspacesActions } from 'store/actions';
import { useEffect } from 'react';

const Main: React.FC = () => {
  const { currentWorkspace } = useAppSelector((state) => state.workspaces);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [cookies] = useCookies([
    CookieVariable.WORKSPACE_ID,
  ]);

  useEffect(() => {
    if (!currentWorkspace) {
      if (cookies[CookieVariable.WORKSPACE_ID]) {
        dispatch(workspacesActions.loadWorkspace(cookies[CookieVariable.WORKSPACE_ID]));
      } else {
        history.push(AppRoute.WORKSPACES);
      }
    }
  }, [currentWorkspace]);

  return (
    <div className={styles.grid}>
      <div className={styles.header}>
        <Header  />
      </div>
      <div className={styles.toolbar}>
        <Toolbar title={currentWorkspace?.title} />
      </div>
      <div className={styles.content}>
        <Switch>
          <ProtectedRoute path={AppRoute.CONTENT_SETTING} component={ContentEditor} exact />
          <ProtectedRoute path={AppRoute.PAGE} component={Pages} />
          <ProtectedRoute path={AppRoute.SETTINGS} component={Settings} />
          <ProtectedRoute path={AppRoute.SETTINGS_PROFILE} component={Profile} exact />
          <ProtectedRoute path={AppRoute.WORKSPACE_SETTING} component={Workspace} exact />
          <ProtectedRoute path={AppRoute.PROFILE} component={ProfileInfo} key={Date.now()} exact />
        </Switch>
      </div>
    </div>
  );
};

export default Main;
