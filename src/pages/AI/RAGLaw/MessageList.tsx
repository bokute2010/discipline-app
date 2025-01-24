import MessageCardIn from './MessageCardIn';
import MessageCardOut from '../MessageCardOut';
import MessageCardLoading from '../MessageCardLoading';
import useRagLawHook from '@/hooks/useRagLawHook';

export default function MessageList() {
  const { messageList, loading } = useRagLawHook();
  
  // TODO: needs types -> Done
  return (
    <div className="flex flex-col gap-5">
      {messageList.map((message, index) => {
        if (message.out) {
          return (
            <MessageCardOut key={index} text={message.prompt || ''} time={message.time || ''} />
          );
        } else if (message.out === false) {
          return (
            <MessageCardIn
              key={index}
              response={message?.response || { response: '', retriever: [''] }}
              time={message.time || ''}
            />
          );
        }
        return null; // Handle cases where neither `in` nor `out` is specified
      })}
      {loading && <MessageCardLoading />}
    </div>
  );
}
