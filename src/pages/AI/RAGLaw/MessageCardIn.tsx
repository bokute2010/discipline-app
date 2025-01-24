import useAIModelHook from '@/hooks/useAIModelHook';
import { IResponseChatRag } from '@/interfaces/RagChat/RagChat.interface';
import { RootState } from '@/redux/store';
import { icons } from '@/theme/image';
import { getShortDesReferences } from '@/utils';
import moment from 'moment';
import { useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useSelector } from 'react-redux';

interface IMessageCardInProps {
  response: IResponseChatRag;
  time: string;
  // avatar: string;
}

const MessageCardIn = ({ response, time }: IMessageCardInProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const container1Ref = useRef<HTMLDivElement>(null);
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
          <div style={{ whiteSpace: 'pre-line' }}>
            <Markdown>{response.response}</Markdown>
          </div>
          <div className="flex flex-col gap-1.5">
            <div id="accordion-collapse" data-accordion="collapse">
              {response.retriever?.map((retriever, index) => (
                <div key={index} className="w-full flex flex-col gap-1.5">
                  <button
                    type="button"
                    className="w-full px-3 py-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50"
                    onClick={() => setSelected(selected !== index + 1 ? index + 1 : null)}
                  >
                    <div className="flex items-center justify-between">
                      <span>Điều {getShortDesReferences(retriever)}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 ${selected === index + 1 ? 'transform rotate-180' : ''}`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </button>
                  <div
                    className="relative overflow-hidden transition-all max-h-0 duration-700"
                    style={{
                      maxHeight:
                        selected === index + 1 ? `${container1Ref.current?.scrollHeight}px` : '0'
                    }}
                    ref={container1Ref}
                  >
                    <div className="pb-6">
                      <p>{retriever}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* {response.retriever.map((retriever, index) => (
              <p
                key={index}
                className="text-2xs font-medium text-gray-500"
                style={{ whiteSpace: 'pre-line' }}
              >
                {retriever}
              </p>
            ))} */}
          </div>
        </div>
        <span className="text-2xs font-medium text-gray-500">
          {moment(time, 'h:mm:ss A').format('h:mm A')}
        </span>
      </div>
    </div>
  );
};

export default MessageCardIn;
