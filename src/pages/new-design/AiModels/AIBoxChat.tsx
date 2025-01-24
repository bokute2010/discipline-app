import { ChatBoxAuditProgressContent } from '@/pages/AI/AuditProgress/ChatBoxAuditProgressContent';

import { NewChatRoomAudit } from '@/pages/AI/AuditProgress/NewChatRoomAudit';
import useAIModelHook from '@/hooks/useAIModelHook';
import { ChatBoxRagLawContent } from '@/pages/AI/RAGLaw/ChatBoxRagLawContent';
import { NewChatRoomRagLaw } from '@/pages/AI/RAGLaw/NewChatRoomRagLaw';
import useAuditProcessHook from '@/hooks/useAuditProcessHook';
import useRagLawHook from '@/hooks/useRagLawHook';
import { useEffect } from 'react';

const AIBoxChat = () => {
  const { chatRoom, selectedNewAssistant } = useAIModelHook();
  const { handleResetStateAudit } = useAuditProcessHook();
  const { handleResetStateRag } = useRagLawHook();

  useEffect(() => {
    return () => {
      handleResetStateAudit();
      handleResetStateRag();
    };
  }, []);

  function renderChatBoxContent() {
    switch (chatRoom) {
      case null:
        if (selectedNewAssistant && selectedNewAssistant.id === 2) {
          return <NewChatRoomAudit assistant={selectedNewAssistant} />;
        } else if (selectedNewAssistant && selectedNewAssistant.id === 1) {
          return <NewChatRoomRagLaw assistant={selectedNewAssistant} />;
        }
        return null;
      case chatRoom:
        if (chatRoom?.assistant.id === 2) {
          return <ChatBoxAuditProgressContent />;
        } else if (chatRoom?.assistant.id === 1) {
          return <ChatBoxRagLawContent />;
        }
        return null;
      default:
        return null;
    }
  }

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title">{selectedNewAssistant?.name || chatRoom?.assistant.name}</h3>
      </div>

      <div className="card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        {renderChatBoxContent()}
      </div>
    </div>
  );
};

export { AIBoxChat };
