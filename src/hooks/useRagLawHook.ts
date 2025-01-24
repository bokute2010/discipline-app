import {
  convertHistoryToMessageList,
  addNewPrompt,
  addNewResponse,
  setLoading,
  resetStateRag
} from '@/redux/slices/rag.slice';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { WS_URL } from '@/api/config';
import { useRef, useState } from 'react';
import { useAuthContext } from '@/auth';
import { IChatRoom, IChatRoomHistory, IMessageHistory } from '@/interfaces/chat-room.interface';
import { useChatRoomCreate } from '@/api/mutations/chatroom.mutation';
import { IResponseChatRag } from '@/interfaces/RagChat/RagChat.interface';
interface WebSocketMessage {
  action: string;
  message?: string;
  user_id?: string;
  chat_room_id?: number | null;
  file_urls?: Array<{ file_name: string; url: string; type: string }>;
  history?: IChatRoomHistory[];
  error?: string;
}

let socket: WebSocket | null = null;

export default function useRagLawHook() {
  const [newChatRoom, setNewChatRoom] = useState<IChatRoom>();
  const { mutate: createChatRoom, isPending: isCreatingChatRoom } = useChatRoomCreate(
    onCreateRoomSuccess,
    onCreateRoomFail
  );
  const hasSocketJoined = useRef(false);
  const [formInput, setFormInput] = useState<string>('');
  const { currentUser } = useAuthContext();
  const { chatRoom } = useSelector((state: RootState) => state.ai);
  const { loading, messageList } = useSelector((state: RootState) => state.rag);
  const dispatch = useDispatch();

  function getChatRoomId() {
    if (newChatRoom) return newChatRoom.id;
    return chatRoom?.chatRoomId;
  }

  function onCreateRoomSuccess(data: IChatRoom) {
    setNewChatRoom(data);
  }

  function onCreateRoomFail() {
    alert('Failed to create chat room');
  }

  function handleCreateChatRoom(assistant_id: number) {
    if (!currentUser) return;
    if (!newChatRoom) {
      createChatRoom({
        user_id: currentUser.cognito_subject_id,
        name: 'Rag Room',
        description: 'New Rag Room',
        assistant_id: assistant_id,
        first_prompt: formInput
      });
    }
  }
  async function sendDataToSocketInNewRoom(assistant_id: number) {
    if (!newChatRoom) {
      handleCreateChatRoom(assistant_id);
      return;
    }
    sendDataToSocket();
  }

  async function handleSendIntroPrompt(assistant_id: number, introPrompt: string) {
    if (!currentUser) return;
    setFormInput(introPrompt);
    createChatRoom({
      user_id: currentUser.cognito_subject_id,
      name: 'Audit Room',
      description: 'Audit Room',
      assistant_id: assistant_id,
      first_prompt: introPrompt
    });
  }

  function handleSetFormInput(input: string) {
    setFormInput(input);
  }

  function handleSendWebSocketMessage(data: WebSocketMessage) {
    console.log('socket.readyState', socket?.readyState, WebSocket.OPEN);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not open');
    }
  }

  function sendDataToSocket() {
    if (!formInput || loading) return;
    handleAddNewPrompt(formInput);
    handleSendWebSocketMessage({
      action: 'rag_law',
      message: formInput,
      user_id: currentUser?.cognito_subject_id,
      file_urls: [],
      chat_room_id: getChatRoomId()
    });
    handleSetFormInput('');
    return;
  }

  function handleAddNewPrompt(prompt: string) {
    dispatch(addNewPrompt(prompt));
  }

  function handleAddNewResponse(response: any) {
    dispatch(addNewResponse(response));
  }

  function handleConvertHistoryToMessageList(history: IMessageHistory[]) {
    dispatch(convertHistoryToMessageList(history));
  }
  function handleChangeLoading(status: boolean) {
    dispatch(setLoading(status));
  }
  function handleResetStateRag() {
    dispatch(resetStateRag());
  }

  function handleConnectWebSocket(newRoom = false) {
    console.log('Connecting WebSocket');
    if (!currentUser) return;
    console.log('socket', socket);
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('WebSocket connected');
      if (!hasSocketJoined.current) {
        handleSendWebSocketMessage({ action: 'join', user_id: currentUser.cognito_subject_id });
        hasSocketJoined.current = true;
      }
      if (hasSocketJoined.current && chatRoom?.chatRoomId && !newRoom) {
        handleSendWebSocketMessage({
          action: 'get_rag_chat_history',
          user_id: currentUser.cognito_subject_id,
          chat_room_id: chatRoom?.chatRoomId
        });
      }
      if (newRoom && newChatRoom) {
        sendDataToSocket();
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      handleSocketMessage(message);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      handleChangeLoading(false);
    };
  }

  function handleSocketMessage(message: {
    action: string;
    history?: IChatRoomHistory[];
    message: IResponseChatRag;
    error?: string;
  }) {
    try {
      console.log('Received message:', message);

      switch (message.action) {
        case 'get_rag_chat_history':
          handleChatHistory(message.history || []);
          break;

        case 'rag_law':
          handleLawResponse(message.message);
          break;

        case 'rag_error':
          handleErrorResponse(message?.error || '');
          break;

        default:
          console.warn('Unknown action:', message.action);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  function handleChatHistory(history: IChatRoomHistory[]) {
    if (history.length > 0) {
      handleConvertHistoryToMessageList(history[0].messages_rag);
    }
  }

  function handleLawResponse(response: IResponseChatRag) {
    console.log('message.message', response);
    handleAddNewResponse(response);
  }

  function handleErrorResponse(response: string) {
    console.error('message.response', response);
    handleAddNewResponse({ response: response, retriever: [] });
  }

  function handleDisconnectWebSocket() {
    if (socket) {
      socket.close();
    }
  }
  let disabledSubmit = !currentUser || loading || isCreatingChatRoom;

  return {
    handleConnectWebSocket,
    handleDisconnectWebSocket,
    handleSetFormInput,
    formInput,
    sendDataToSocket,
    hasSocketJoined,
    sendDataToSocketInNewRoom,
    newChatRoom,

    messageList,
    handleAddNewPrompt,
    handleAddNewResponse,
    handleConvertHistoryToMessageList,
    handleChangeLoading,
    handleResetStateRag,
    disabledSubmit,
    loading,
    createChatRoom,
    handleSendIntroPrompt
  };
}
