import { useViewport } from '@/hooks';
import { useEffect, useRef, useState } from 'react';
import { calculateScrollableHeight, getHeight, scrollToBottom } from '@/utils';
import MessageList from './MessageList';
import InputMessage from './InputMessage';
import useAuditProcessHook from '@/hooks/useAuditProcessHook';

const ChatBoxAuditProgressContent = () => {
  const { messageList } = useAuditProcessHook();
  const messagesRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [scrollableHeight, setScrollableHeight] = useState<number>(0);
  const [viewportHeight] = useViewport();
  const offset = 180;

  useEffect(() => {
    if (messagesRef.current) {
      const height = calculateScrollableHeight(messagesRef, footerRef, viewportHeight, offset);
    setScrollableHeight(height);
    }
  }, [viewportHeight]);

  useEffect(() => {
    // if (messagesRef.current) {
    //   messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    // }
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
      <div ref={footerRef} className="flex-shrink-0">
        <InputMessage />
      </div>
    </div>
  );
};

export { ChatBoxAuditProgressContent };
