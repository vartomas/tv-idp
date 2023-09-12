import { Input, InputRef, Modal } from 'antd';
import { FC, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InferType, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormError from '../../../components/FormError';

interface Props {
  open: boolean;
  loading: boolean;
  onJoin: (name: string) => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const createChannelSchema = object({
  id: string()
    .required('Channel id required')
    .matches(/^[0-9]*$/, 'Only numbers'),
});
type JoinChannelFrom = InferType<typeof createChannelSchema>;

const JoinChannelModal: FC<Props> = ({ open, loading, onJoin, onOpenChange }) => {
  const inputRef = useRef<InputRef>(null);
  const { control, handleSubmit, reset } = useForm<JoinChannelFrom>({
    mode: 'onChange',
    defaultValues: { id: '' },
    resolver: yupResolver(createChannelSchema),
  });

  const handleOk = handleSubmit((data) => {
    onJoin(data.id);
    reset();
  });

  const setFocus = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  useEffect(() => {
    if (open) {
      setFocus();
    }
  }, [open]);

  return (
    <Modal
      title="Create channel"
      open={open}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => onOpenChange(false)}
    >
      <form onSubmit={handleOk}>
        <p>Id:</p>
        <Controller
          name="id"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Input {...field} ref={inputRef} />
              <FormError error={error?.message} />
            </>
          )}
        />
        <input type="submit" hidden />
      </form>
    </Modal>
  );
};

export default JoinChannelModal;
