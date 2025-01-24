import { useViewport } from '@/hooks';
import { useEffect, useRef, useState } from 'react';
import { calculateScrollableHeight, scrollToBottom } from '@/utils';
import MessageList from './MessageList';
import InputMessage from './InputMessage';
import useRagLawHook from '@/hooks/useRagLawHook';

const ChatBoxRagLawContent = () => {
  const { messageList } = useRagLawHook();
  const messagesRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [scrollableHeight, setScrollableHeight] = useState<number>(0);
  const [viewportHeight] = useViewport();
  const offset = 180;

  // TODO: duplicate code -> need to put in utils -> Done
  useEffect(() => {
    const height = calculateScrollableHeight(messagesRef, footerRef, viewportHeight, offset);
    setScrollableHeight(height);
  }, [viewportHeight]);

  useEffect(() => {
    scrollToBottom(messagesRef);
  }, [messageList]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={messagesRef}
        className="flex-grow scrollable-y-auto"
        style={{ maxHeight: `${scrollableHeight}px` }}
      >
        <MessageList />
      </div>
      <div ref={footerRef}>
        <InputMessage />
      </div>
    </div>
  );
};

export { ChatBoxRagLawContent };
