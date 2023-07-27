import { Button, Card, Input } from 'antd';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../core/hooks/useAuth';
import { object, string, InferType, ref } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormError from '../components/FormError';
import { Link } from 'react-router-dom';

const loginSchema = object({
  username: string()
    .required('Username required')
    .matches(/^[a-zA-Z0-9]*$/, 'Only letters or numbers'),
  password: string().required('Password required'),
  repeatPassword: string()
    .required('Repeat password required')
    .oneOf([ref('password')], 'Passwords must match'),
});
type RegisterForm = InferType<typeof loginSchema>;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<RegisterForm>({
    mode: 'onSubmit',
    defaultValues: { username: '', password: '', repeatPassword: '' },
    resolver: yupResolver(loginSchema),
  });
  const { register } = useAuth();

  const submit = handleSubmit(async (data) => {
    setLoading(true);
    await register(data.username, data.password);
    setLoading(false);
  });

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card title="Register" style={{ width: 300 }} className="shadow-lg">
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
          <Controller
            name="repeatPassword"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input {...field} placeholder="Repeat password" type="password" />
                <FormError error={error?.message} renderEmpty />
              </>
            )}
          />
          <div className="flex justify-center items-center">
            <Button type="primary" loading={loading} onClick={submit}>
              Register
            </Button>
          </div>
          <p className="text-xs mt-3">
            Already have account?
            <span className="underline text-sky-600 ml-1">
              <Link to="/">Login</Link>
            </span>
          </p>
          <input type="submit" hidden />
        </form>
      </Card>
    </div>
  );
};

export default Login;
