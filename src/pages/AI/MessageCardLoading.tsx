import useAIModelHook from '@/hooks/useAIModelHook';

const MessageCardLoading = () => {
  const { getAssistantAvatar } = useAIModelHook();
  return (
    <div className="flex items-start gap-3.5 px-5">
      <img src={getAssistantAvatar()} className="size-9 rounded-full" alt="" />
      <div className="flex flex-col gap-2.5">
        <div className="card shadow-none flex flex-col gap-2.5 p-3 rounded-bl-none text-2sm font-medium text-gray-700">
          {/* give me loading three dots */}
          <div className="flex space-x-2 justify-center items-center dark:invert">
            <span className="sr-only"> Tải xuống...</span>
            <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-black rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCardLoading;
