import { IAssistant } from '@/interfaces/assistant.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// TODO: are we using both react query and redux?
// Answer: Yes, we are using both react query and redux. React query is used for data fetching and caching, while redux is used for managing the state of the application.
interface IAIState {
  chatRoom: IChatRoomPayloadRedux | null;
  selectedNewAssistant: IAssistant | null;
}

export interface IChatRoomPayloadRedux {
  chatRoomId: number;
  assistant: {
    id: number;
    name: string;
    avatar_url?: string | null;
  };
}

const initialState: IAIState = {
  chatRoom: null,
  selectedNewAssistant: null
};

// Missing types
const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setChatRoom: (state, action: PayloadAction<IChatRoomPayloadRedux | null>) => {
      state.chatRoom = action.payload;
      state.selectedNewAssistant = null;
    },
    setSelectedNewAssistant: (
      state,
      action: PayloadAction<{ id: number; name: string, avatar_url?: string } | null>
    ) => {
      state.selectedNewAssistant = action.payload;
      state.chatRoom = null;
    }
  }
});

export const { setChatRoom, setSelectedNewAssistant } = aiSlice.actions;
export default aiSlice.reducer;
