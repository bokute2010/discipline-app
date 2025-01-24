
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setSelectedNewAssistant } from '@/redux/slices/ai.slice';
import { IAssistant } from '@/interfaces/assistant.interface';
import useAIModelHook from './useAIModelHook';
export default function useSavedPromptlHook() {
  const { onSavedAssistantToLocalstorage } = useAIModelHook();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function navigateToChatRoom(content: string, assistant: IAssistant) {
    console.log('navigateToChatRoom:', content, assistant);
    onSavedAssistantToLocalstorage(assistant.id, assistant.avatar_url);
    dispatch(setSelectedNewAssistant(assistant));
    navigate('/', { state: content });
  }
  return {
    navigateToChatRoom
  };
}
