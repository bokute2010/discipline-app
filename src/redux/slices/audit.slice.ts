import { IChatAuditMessage } from '@/interfaces/audit/audit.interface';
import { IMessageHistory } from '@/interfaces/chat-room.interface';
import { sortMessageListByTime } from '@/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

interface IAuditProcessState {
  loading: boolean;
  messageList: IChatAuditMessage[];
}

const initialState: IAuditProcessState = {
  loading: false,
  messageList: []
};

// TODO: types -> Done
const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMessageList: (state, action: PayloadAction<IChatAuditMessage[]>) => {
      state.messageList = action.payload;
    },
    addNewPrompt: (state, action: PayloadAction<string>) => {
      state.messageList.push({
        prompt: action.payload,
        out: true,
        time: new Date().toLocaleTimeString()
      });
      state.loading = true;
    },
    addNewResponse: (state, action: PayloadAction<string>) => {
      state.messageList.push({
        response: action.payload,
        out: false,
        time: new Date().toLocaleTimeString()
      });
      // state.loading = false;
    },
    convertHistoryToMessageList: (state, action: PayloadAction<IMessageHistory[]>) => {
      const newMessageList = [] as IChatAuditMessage[];
      action.payload.forEach((historyMessage) => {
        newMessageList.push({
          prompt: historyMessage.prompt,
          time: moment.utc(historyMessage.created_at).local().format('DD/MM/yyyy, h:mm A'),
          out: true
        });
        newMessageList.push({
          response: historyMessage.response,
          time: moment.utc(historyMessage.created_at).local().format('DD/MM/yyyy, h:mm A'),
          out: false
        });
      });

      const sortedMessageList = sortMessageListByTime(newMessageList);
      state.messageList = sortedMessageList;
    },

    resetStateAudit: (state) => {
      state.messageList = [];
      state.loading = false;
    }
  }
});

export const {
  resetStateAudit,
  setLoading,
  setMessageList,
  addNewPrompt,
  addNewResponse,
  convertHistoryToMessageList
} = auditSlice.actions;

export default auditSlice.reducer;
