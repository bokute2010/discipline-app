import MessageCardIn from './MessageCardIn';

import MessageCardLoading from '../MessageCardLoading';
import useAuditProcessHook from '@/hooks/useAuditProcessHook';
import MessageCardOut from '../MessageCardOut';

export default function MessageList() {
  const { loading, messageList } = useAuditProcessHook();

  // TODO: add types
  return (
    <div className="flex flex-col gap-5">
      {messageList.map((message, index) => {
        if (message.out && message.prompt) {
          return (
            <MessageCardOut key={index} text={message.prompt || ''} time={message.time || ''} />
          );
        } else if (message.out === false) {
          return (
            <MessageCardIn key={index} text={message?.response || ''} time={message.time || ''} />
          );
        }
        return null; // Handle cases where neither `in` nor `out` is specified
      })}
      {loading && <MessageCardLoading />}
    </div>
  );
}
