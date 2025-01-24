import useAIModelHook from '@/hooks/useAIModelHook';
import { RootState } from '@/redux/store';

import { useSelector } from 'react-redux';

interface IMessageCardInProps {
  text: string;
  time: string;
}

const MessageCardIn = ({ text, time }: IMessageCardInProps) => {
  const { chatRoom } = useSelector((state: RootState) => state.ai);
  const { getAssistantAvatar } = useAIModelHook();
  return (
    <div className="flex items-start gap-3.5 px-5">
      <img
        src={getAssistantAvatar()}
        className="size-9 rounded-full"
        alt={chatRoom?.assistant.name}
      />

      <div className="flex flex-col gap-1.5">
        <div className="card shadow-none flex flex-col gap-2.5 p-3 rounded-bl-none text-2sm font-medium text-gray-700">
          <div style={{ whiteSpace: 'pre-line' }}>{text}</div>
        </div>
        <span className="text-2xs font-medium text-gray-500">{time}</span>
      </div>
    </div>
  );
};

export default MessageCardIn;
