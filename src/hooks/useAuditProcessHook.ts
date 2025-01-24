import { useAuthContext } from '@/auth';
import { IPayloadGenerateMultiPresignedUrl } from '@/interfaces/audit/audit.interface';
import {
  convertHistoryToMessageList,
  addNewPrompt,
  addNewResponse,
  setLoading,
  resetStateAudit
} from '@/redux/slices/audit.slice';

import { RootState } from '@/redux/store';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGenerateMultiPresignedUrls,
  useUploadFileByPresignedUrl
} from '@/api/mutations/audit.mutation';
import { getExtensionFile, getUrlFromPresignedUrl } from '@/utils';
import { WS_URL } from '@/api/config';
import { IChatRoom, IChatRoomHistory } from '@/interfaces/chat-room.interface';
import { useChatRoomCreate } from '@/api/mutations/chatroom.mutation';
interface WebSocketMessage {
  action: string;
  message?: string;
  user_id?: string;
  chat_room_id?: number;
  file_urls?: Array<{ file_name: string; url: string; type: string }>;
  history?: IChatRoomHistory[];
  error?: string;
  is_continue?: boolean;
}

interface FileData {
  name: string;
  file: File;
}
let socket: WebSocket | null = null;

export default function useAuditProcessHook() {
  const [newChatRoom, setNewChatRoom] = useState<IChatRoom>();

  const { mutate: createChatRoom, isPending: isCreatingChatRoom } = useChatRoomCreate(
    onCreateRoomSuccess,
    onCreateRoomFail
  );
  const [listFile, setListFile] = useState<FileData[]>([]);
  const hasSocketJoined = useRef(false);
  const [formInput, setFormInput] = useState<string>('');
  const { currentUser } = useAuthContext();
  const { mutate: getPresignedUrls } = useGenerateMultiPresignedUrls(
    onSuccessCreatePresignedUrls,
    onErrorCreatePresignedUrls
  );
  const { chatRoom } = useSelector((state: RootState) => state.ai);
  const { mutate: uploadFile } = useUploadFileByPresignedUrl();

  const { loading, messageList } = useSelector((state: RootState) => state.audit);
  const dispatch = useDispatch();

  function getChatRoomId() {
    if (newChatRoom) return newChatRoom.id;
    return chatRoom?.chatRoomId;
  }
  function onCreateRoomSuccess(data: IChatRoom) {
    setNewChatRoom(data);
  }

  function onCreateRoomFail() {
    return;
  }

  function handleCreateChatRoom(assistant_id: number) {
    if (!currentUser) return;
    if (!newChatRoom) {
      createChatRoom({
        user_id: currentUser.cognito_subject_id,
        name: 'Audit Room',
        description: 'Audit Room',
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

  function handleSetListFile(files: FileData[]) {
    setListFile(files);
  }

  function handleAddNewPrompt(prompt: string) {
    dispatch(addNewPrompt(prompt));
  }

  function handleAddNewResponse(response: any) {
    dispatch(addNewResponse(response));
  }

  function handleConvertHistoryToMessageList(history: any[]) {
    dispatch(convertHistoryToMessageList(history));
  }
  function handleChangeLoading(status: boolean) {
    dispatch(setLoading(status));
  }
  function handleResetStateAudit() {
    dispatch(resetStateAudit());
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
    if (loading || (!formInput && !listFile.length)) return;
    const formattedPrompt = formatPromptWithFiles(formInput, listFile);
    handleAddNewPrompt(formattedPrompt);
    if (!listFile.length) {
      handleSendWebSocketMessage({
        action: 'audit_process',
        message: formInput,
        user_id: currentUser?.cognito_subject_id,
        file_urls: [],
        chat_room_id: getChatRoomId()
      });
      handleSetFormInput('');
      return;
    }
    const payload: IPayloadGenerateMultiPresignedUrl = {
      file_names: listFile.map((file) => file.name)
    };
    getPresignedUrls(payload);
  }

  function formatPromptWithFiles(formInput: string, listFile: FileData[]): string {
    if (listFile.length) {
      const fileNames = listFile.map((file) => file.name).join(', ');
      return formInput
        ? `Tôi đã đính kèm các tệp sau: ${fileNames}.\n${formInput}`
        : `Tôi đã đính kèm các tệp sau: ${fileNames}.`;
    }
    return formInput;
  }

  function onSuccessCreatePresignedUrls(data: Record<string, string>) {
    const listFileUrls = listFile.map((file) => {
      const presignedUrl = data[file.name];
      uploadFile({ url: presignedUrl, file: file.file });
      return {
        file_name: file.name,
        url: getUrlFromPresignedUrl(presignedUrl),
        type: getExtensionFile(file.name) ?? ''
      };
    });

    handleSendWebSocketMessage({
      action: 'audit_process',
      message: formInput,
      user_id: currentUser?.cognito_subject_id,
      file_urls: listFileUrls,
      chat_room_id: getChatRoomId()
    });

    handleSetListFile([]);
    handleSetFormInput('');
  }

  function onErrorCreatePresignedUrls() {
    handleAddNewPrompt('An error occurred while generating presigned URLs');
    handleChangeLoading(false);
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
          action: 'get_audit_chat_history',
          user_id: currentUser.cognito_subject_id,
          chat_room_id: chatRoom?.chatRoomId
        });
      }
      if (newRoom) {
        sendDataToSocket();
      }
    };
    socket.onmessage = (event) => {
      const messageData: WebSocketMessage = JSON.parse(event.data);
      console.log('Received message:', messageData);
      handleSocketMessage(messageData);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }

  function handleSocketMessage(message: WebSocketMessage) {
    try {
      console.log('Received message:', message);
      
      switch (message.action) {
        case 'get_audit_chat_history':
          handleChatHistory(message.history || []);
          break;

        case 'audit_message':
          checkIsLoadingContinue(message.is_continue || false);
          handleAuditResponse(message?.message || '');
          break;

        case 'audit_error':
          checkIsLoadingContinue(message.is_continue || false);
          handleErrorResponse(message?.error || '');
          break;

        default:
          console.warn('Unknown action:', message.action);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  function checkIsLoadingContinue(isContinue: boolean) {
    if (!isContinue) {
      handleChangeLoading(false);
      return
    }
    handleChangeLoading(true);
  }

  function handleChatHistory(history: IChatRoomHistory[]) {
    if (history.length > 0) {
      handleConvertHistoryToMessageList(history[0].messages_audit);
    }
  }

  function handleAuditResponse(response: string) {
    console.log('message.message', response);
    handleAddNewResponse(response);
  }

  function handleErrorResponse(response: string) {
    console.error('message.response', response);
    handleAddNewResponse(response);
  }

  function handleDisconnectWebSocket() {
    if (socket) {
      socket.close();
    }
  }

  let disabledSubmit = !currentUser || loading || isCreatingChatRoom;

  return {
    newChatRoom,
    sendDataToSocketInNewRoom,
    messageList,
    handleAddNewPrompt,
    handleAddNewResponse,
    handleConvertHistoryToMessageList,
    handleChangeLoading,
    handleResetStateAudit,
    handleSendWebSocketMessage,

    hasSocketJoined,
    listFile,
    handleSetListFile,
    formInput,
    handleSetFormInput,
    socket,
    sendDataToSocket,
    handleConnectWebSocket,
    handleDisconnectWebSocket,
    disabledSubmit,
    loading,
    createChatRoom,
    handleSendIntroPrompt
  };
}
