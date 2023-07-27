import { useNotification } from './useNotification';

export const useApi = () => {
  const { notifyError } = useNotification();

  const call = async <T = undefined>(fn: (...args: unknown[]) => Promise<Response>, notifyErrors = false) => {
    const response = await fn();
    if (response.status !== 200) {
      const data = (await response.json()) as { message: string };
      if (notifyErrors) {
        notifyError(data.message || 'Something went wrong');
      }
      return;
    }
    return (await response.json()) as T;
  };

  return { call };
};
