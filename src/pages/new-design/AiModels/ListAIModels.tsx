import { useFetchAssistants } from '@/api/query/assistant.query';
import useAIModelHook from '@/hooks/useAIModelHook';
import { IAssistant } from '@/interfaces/assistant.interface';
import { icons } from '@/theme/image';
import clsx from 'clsx';

const ListAiModels = () => {
  const { data: listAssistants, isLoading } = useFetchAssistants();
  const { handleSetSelectedNewAssistant, selectedNewAssistant } = useAIModelHook();
  const renderRow = (assistant: IAssistant, index: number) => {
    return (
      <div key={index} className="flex items-center justify-between flex-wrap gap-2">
        <div
          className={clsx('flex items-center gap-1.5 w-full rounded-lg p-2', {
            'bg-gray-200': selectedNewAssistant?.id === assistant.id
          })}
        >
          <img
            src={assistant.avatar_url || icons.aiAvatar}
            className="size-7 rounded-full"
            alt={assistant.name}
          />
          <span
            className="text-sm font-normal text-gray-900 cursor-pointer"
            onClick={() => handleSetSelectedNewAssistant(assistant)}
          >
            {assistant.name}
          </span>
        </div>
      </div>
    );
  };
  if (isLoading) {
    return <div> Tải xuống...</div>;
  }

  return (
    <div className="card h-fit-content">
      <div className="card-header">
        <h3 className="card-title">Các chức năng</h3>
      </div>

      <div className="card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="grid gap-3">{listAssistants?.map(renderRow)}</div>
      </div>
    </div>
  );
};

export { ListAiModels };
