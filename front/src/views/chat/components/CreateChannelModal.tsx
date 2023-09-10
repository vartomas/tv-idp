import { Input, InputRef, Modal } from 'antd';
import { FC, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InferType, object, string } from 'yup';
import FormError from '../../../components/FormError';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props {
  open: boolean;
  loading: boolean;
  onCreate: (name: string) => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const createChannelSchema = object({
  name: string()
    .required('Channel name required')
    .matches(/^[a-zA-Z0-9]*$/, 'Only letters or numbers'),
});
type CreateChannelFrom = InferType<typeof createChannelSchema>;

const CreateChannelModal: FC<Props> = ({ open, loading, onCreate, onOpenChange }) => {
  const inputRef = useRef<InputRef>(null);
  const { control, handleSubmit, reset } = useForm<CreateChannelFrom>({
    mode: 'onChange',
    defaultValues: { name: '' },
    resolver: yupResolver(createChannelSchema),
  });

  const handleOk = handleSubmit((data) => {
    onCreate(data.name);
    reset();
  });

  const setFocus = () => {
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      });
    }
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
        <p>Name:</p>
        <Controller
          name="name"
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

export default CreateChannelModal;
