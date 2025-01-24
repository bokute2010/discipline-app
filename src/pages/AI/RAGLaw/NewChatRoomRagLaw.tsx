import { useViewport } from '@/hooks';
import { useEffect, useRef, useState } from 'react';
import { calculateScrollableHeight, getHeight, scrollToBottom } from '@/utils';
import MessageList from './MessageList';
import InputMessageNewRoom from './InputMessageNewRoom';
import useRagLawHook from '@/hooks/useRagLawHook';
import { IAssistant } from '@/interfaces/assistant.interface';
import { WelcomeAssistant } from '../WelcomeAssistant';

const NewChatRoomRagLaw = ({ assistant }: { assistant: IAssistant }) => {
  const { messageList } = useRagLawHook();
  const messagesRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [scrollableHeight, setScrollableHeight] = useState<number>(0);
  const [viewportHeight] = useViewport();
  const offset = 180;
  const [introPrompt, setIntroPrompt] = useState<string>('');

  useEffect(() => {
    const height = calculateScrollableHeight(messagesRef, footerRef, viewportHeight, offset);
    setScrollableHeight(height);
  }, [viewportHeight]);

  useEffect(() => {
    scrollToBottom(messagesRef);
  }, [messageList]);

  return (
    <div className="flex flex-col h-full">
      {messageList.length === 0 && <WelcomeAssistant setIntroPrompt={setIntroPrompt} />}
      <div
        ref={messagesRef}
        className="flex-grow scrollable-y-auto"
        style={{ maxHeight: `${scrollableHeight}px` }}
      >
        <MessageList />
      </div>
      <div ref={footerRef}>
        <InputMessageNewRoom
          assistant_id={assistant?.id}
          setIntroPrompt={setIntroPrompt}
          introPrompt={introPrompt}
        />
      </div>
    </div>
  );
};

export { NewChatRoomRagLaw };
