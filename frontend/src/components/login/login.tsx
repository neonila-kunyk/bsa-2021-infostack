import * as React from 'react';
import { AppRoute } from 'common/enums/enums';
import FormField from 'components/common/form-field/form-field';
import Sign from 'components/common/sign/sign';
import { useAppDispatch, useHistory } from 'hooks/hooks';
import { authActions } from 'store/auth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../validations/login-schema';
import { ILogin } from 'infostack-shared';
import styles from './styles.module.scss';
import { Link } from 'components/common/common';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({ resolver: yupResolver(loginSchema) });

  const handleSubmitForm = async (data: ILogin): Promise<void> => {
    await dispatch(authActions.login(data));
    push(AppRoute.WORKSPACES);
  };

  return (
    <Sign
      header="Welcome back"
      secondaryText="Sign in to your account to continue"
      onSubmit={handleSubmit(handleSubmitForm)}
      submitText="Sign in"
    >
      <FormField
        label="Email"
        type="email"
        placeholder="Enter your email"
        register={register('email')}
        errors={errors.email}
        controlId="loginEmail"
      />
      <FormField
        register={register('password')}
        label="Password"
        type="password"
        placeholder="Enter your password"
        errors={errors.password}
        helper={
          <Link className={styles.link} to={AppRoute.RESET_PASSWORD}>
            Forgot password?
          </Link>
        }
      />
    </Sign>
  );
};

export default Login;
