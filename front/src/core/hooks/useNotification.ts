import { notification } from 'antd';

export const useNotification = () => {
  const notifyError = (description: string, title?: string) => {
    notification.error({
      message: title || 'Error',
      description: description,
      placement: 'bottomRight',
    });
  };

  const notifySuccess = (description: string, title?: string) => {
    notification.success({
      message: title || 'Success',
      description: description,
      placement: 'bottomRight',
    });
  };

  const notifyInfo = (description: string, title?: string) => {
    notification.info({
      message: title || 'Info',
      description: description,
      placement: 'bottomRight',
    });
  };

  return {
    notifyError,
    notifySuccess,
    notifyInfo,
  };
};
