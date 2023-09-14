import { Input } from 'antd';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ChatInputForm } from '../chatModel';

const { TextArea } = Input;

interface Props {
  sendMessage: (message: string) => Promise<void>;
}

const ChatInput: FC<Props> = ({ sendMessage }) => {
  const { control, handleSubmit, setValue } = useForm<ChatInputForm>();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
      setValue('message', '');
    }
  };

  const onSubmit: SubmitHandler<ChatInputForm> = (data) => {
    if (data.message) {
      sendMessage(data.message);
    }
  };

  return (
    <div className="w-full h-full py-2 pr-2">
      <Controller
        control={control}
        name="message"
        render={({ field }) => (
          <TextArea
            {...field}
            className="h-full"
            autoSize={{ minRows: 3, maxRows: 3 }}
            autoFocus
            onKeyDown={handleKeyDown}
          />
        )}
      />
    </div>
  );
};

export default ChatInput;
