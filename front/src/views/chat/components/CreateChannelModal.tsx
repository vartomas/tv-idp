import { Input, Modal } from 'antd';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InferType, object, string } from 'yup';

interface Props {
  open: boolean;
  loading: boolean;
  onCreate: (name: string) => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const createChannelSchema = object({
  name: string()
    .required('Username required')
    .matches(/^[a-zA-Z0-9]*$/, 'Only letters or numbers'),
});
type CreateChannelFrom = InferType<typeof createChannelSchema>;

const CreateChannelModal: FC<Props> = ({ open, loading, onCreate, onOpenChange }) => {
  const { control, handleSubmit, reset } = useForm<CreateChannelFrom>({
    mode: 'onChange',
    defaultValues: { name: '' },
  });

  const handleOk = handleSubmit((data) => {
    onCreate(data.name);
    reset();
  });

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
        <Controller name="name" control={control} render={({ field }) => <Input {...field} />} />
        <input type="submit" hidden />
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
