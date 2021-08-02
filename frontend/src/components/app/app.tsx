import Login from 'components/login/login';
import SignUp from 'components/sign-up/sign-up';
import Workspaces from 'components/workspaces/workspaces';
import Workspace from 'components/workspace/workspace';
import Pages from 'components/pages/pages';
import Header from 'components/header/header';
import Profile from 'components/profile/profile';
import ProtectedRoute from 'components/common/protected-route/protected-route';
import { AppRoute } from 'common/enums/enums';
import { Route, Switch } from 'components/common/common';
import { useLocation } from 'hooks/hooks';
import '../../assets/css/styles.scss';

const App: React.FC = () => {
  const { pathname } = useLocation();
  const isHeaderRendered = !(
    [AppRoute.LOGIN, AppRoute.SIGN_UP] as string[]
  ).includes(pathname);

  return (
    <>
      {isHeaderRendered && <Header />}
      <Switch>
        <Route path={AppRoute.LOGIN} component={Login} exact />
        <Route path={AppRoute.SIGN_UP} component={SignUp} exact />
        <ProtectedRoute
          path={AppRoute.ROOT}
          component={(): JSX.Element => <h2>Stub</h2>}
          exact
        />
        <ProtectedRoute
          path={AppRoute.WORKSPACES}
          component={Workspaces}
          exact
        />
        <ProtectedRoute path={AppRoute.PAGES} component={Pages} exact />
        <ProtectedRoute
          path={AppRoute.SETTINGS_PROFILE}
          component={Profile}
          exact
        />
        <ProtectedRoute
          path={AppRoute.WORKSPACE_SETTING}
          component={Workspace}
          exact
        />
      </Switch>
    </>
  );
};

export default App;
