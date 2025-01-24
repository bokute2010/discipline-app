import {
  IChatRoomPayloadRedux,
  setChatRoom,
  setSelectedNewAssistant
} from '@/redux/slices/ai.slice';

import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import useAuditProcessHook from './useAuditProcessHook';
import useRagLawHook from './useRagLawHook';
import { icons } from '@/theme/image';
export default function useAIModelHook() {
  const dispatch = useDispatch();
  const { handleResetStateAudit } = useAuditProcessHook();
  const { handleResetStateRag } = useRagLawHook();
  const { chatRoom, selectedNewAssistant } = useSelector((state: RootState) => state.ai);
  const onSavedAssistantToLocalstorage = (id: number, avatar_url?: string) => {
    console.log('handleSetSelectedNewAssistant:', id, avatar_url);
    localStorage.setItem('assistantId', id.toString());
    localStorage.setItem('assistantAvatar', avatar_url || '');
  };
  function handleSetChatRoom(payload: IChatRoomPayloadRedux | null) {
    if (chatRoom?.chatRoomId === payload?.chatRoomId) return;
    handleResetStateAudit();
    handleResetStateRag();
    dispatch(setChatRoom(payload));
  }
  function handleSetSelectedNewAssistant(
    payload: { id: number; name: string; avatar_url?: string } | null
  ) {
    if (payload?.id !== undefined) {
      onSavedAssistantToLocalstorage(payload.id, payload.avatar_url);
    }
    handleResetStateAudit();
    handleResetStateRag();
    dispatch(setSelectedNewAssistant(payload));
  }

  const getAssistantAvatar = () => {
    return (
      chatRoom?.assistant.avatar_url || localStorage.getItem('assistantAvatar') || icons.aiAvatar
    );
  };
  return {
    chatRoom,
    selectedNewAssistant,
    handleSetChatRoom,
    handleSetSelectedNewAssistant,
    getAssistantAvatar,
    onSavedAssistantToLocalstorage
  };
}
