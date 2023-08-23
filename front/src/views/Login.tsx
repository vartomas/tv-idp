import { Button, Card, Input } from 'antd';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../core/hooks/useAuth';
import { object, string, InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormError from '../components/FormError';
import { Link } from 'react-router-dom';

const loginSchema = object({
  username: string()
    .required('Username required')
    .matches(/^[a-zA-Z0-9]*$/, 'Only letters or numbers'),
  password: string().required('Password required'),
});
type LoginForm = InferType<typeof loginSchema>;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginForm>({
    mode: 'onSubmit',
    defaultValues: { username: '', password: '' },
    resolver: yupResolver(loginSchema),
  });
  const { login } = useAuth();

  const submit = handleSubmit(async (data) => {
    setLoading(true);
    await login(data.username, data.password);
    setLoading(false);
  });

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card title="Login" style={{ width: 300 }} className="shadow-lg">
        <form onSubmit={submit}>
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input {...field} placeholder="Username" />
                <FormError error={error?.message} renderEmpty />
              </>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input {...field} placeholder="Password" type="password" />
                <FormError error={error?.message} renderEmpty />
              </>
            )}
          />
          <div className="flex justify-center items-center">
            <Button type="primary" loading={loading} onClick={submit}>
              Login
            </Button>
          </div>
          <p className="text-xs mt-3">
            Don't have account?
            <span className="underline text-sky-600 ml-1">
              <Link to="/register">Register</Link>
            </span>
          </p>
          <input type="submit" hidden />
        </form>
      </Card>
    </div>
  );
};

export default Login;
