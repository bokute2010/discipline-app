import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChatRagMessage, IResponseChatRag } from '@/interfaces/RagChat/RagChat.interface';
import { IMessageHistory } from '@/interfaces/chat-room.interface';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { sortMessageListByTime } from '@/utils';
interface IAuditProcessState {
  loading: boolean;
  messageList: IChatRagMessage[];
}

const initialState: IAuditProcessState = {
  loading: false,
  messageList: []
};

// TODO: types -> Done
const auditSlice = createSlice({
  name: 'rag',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMessageList: (state, action: PayloadAction<IChatRagMessage[]>) => {
      state.messageList = action.payload;
    },
    addNewPrompt: (state, action: PayloadAction<string>) => {
      state.messageList.push({
        prompt: action.payload,
        out: true,
        time: new Date().toLocaleTimeString(),
        uuid: uuidv4()
      });
      state.loading = true;
    },
    addNewResponse: (state, action: PayloadAction<IResponseChatRag>) => {
      state.messageList = [
        ...state.messageList,
        {
          response: {
            response: action.payload.response,
            retriever: action.payload.retriever
          },
          out: false,
          time: new Date().toLocaleTimeString(),
          uuid: uuidv4()
        }
      ];
      state.loading = false;
    },
    convertHistoryToMessageList: (state, action: PayloadAction<IMessageHistory[]>) => {
      const newMessageList = [] as IChatRagMessage[];
      action.payload.forEach((historyMessage) => {
        newMessageList.push({
          prompt: historyMessage.prompt,
          time: moment.utc(historyMessage.created_at).local().format('DD/MM/yyyy, h:mm A'),
          out: true
        });
        newMessageList.push({
          response: {
            response: historyMessage.response,
            retriever: historyMessage?.retriever || []
          },
          time: moment.utc(historyMessage.created_at).local().format('DD/MM/yyyy, h:mm A'),
          out: false
        });
      });
      const sortedMessageList = sortMessageListByTime(newMessageList);
      state.messageList = sortedMessageList;
    },

    resetStateRag: (state) => {
      state.messageList = [];
      state.loading = false;
    }
  }
});

export const {
  resetStateRag,
  setLoading,
  setMessageList,
  addNewPrompt,
  addNewResponse,
  convertHistoryToMessageList
} = auditSlice.actions;

export default auditSlice.reducer;
