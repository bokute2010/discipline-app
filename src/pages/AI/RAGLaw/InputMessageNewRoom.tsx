import { useAuthContext } from '@/auth';
import useRagLawHook from '@/hooks/useRagLawHook';
import { icons } from '@/theme/image';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface InputMessageNewRoomProps {
  assistant_id: number;
  introPrompt: string;
  setIntroPrompt?: React.Dispatch<React.SetStateAction<string>>;
}

export default function InputMessageNewRoom({
  assistant_id,
  introPrompt,
  setIntroPrompt
}: InputMessageNewRoomProps) {
  const location = useLocation();
  console.log('location', location.state);
  const navigation = useNavigate();

  const { currentUser } = useAuthContext();
  const {
    handleConnectWebSocket,
    handleDisconnectWebSocket,
    formInput,
    handleSetFormInput,
    newChatRoom,
    sendDataToSocketInNewRoom,
    disabledSubmit,
    createChatRoom,
    handleSendIntroPrompt
  } = useRagLawHook();

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      sendDataToSocketInNewRoom(assistant_id);
    }
  });

  useEffect(() => {
    if (introPrompt) {
      handleSendIntroPrompt(assistant_id, introPrompt);
      setIntroPrompt && setIntroPrompt('');
    }
  }, [introPrompt]);

  // TODO: socket -> functions -> done
  useEffect(() => {
    if (!newChatRoom) return;
    handleConnectWebSocket(true);

    return () => {
      handleDisconnectWebSocket();
    };
  }, [newChatRoom]);

  // handle get saved prompt from location state
  useEffect(() => {
    if (!location.state || !currentUser) return;
    handleSetFormInput(location.state as string);
    createChatRoom({
      name: 'new room',
      assistant_id: assistant_id,
      first_prompt: location.state as string,
      user_id: currentUser?.cognito_subject_id
    });
    navigation(location.pathname, { state: null });
  }, [location.state]);

  return (
    <div className="relative grow mx-5 mb-2.5">
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          className="input h-auto py-4 ps-6 pe-14 bg-transparent rounded-full"
          onChange={(event) => {
            handleSetFormInput(event.target.value);
          }}
          placeholder="Write a message..."
          value={formInput}
          disabled={disabledSubmit}
        />

        <div className="flex items-center gap-2.5 absolute right-3 top-1/2 -translate-y-1/2">
          <button
            type="submit"
            className="cursor-pointer hover:scale-150"
            disabled={disabledSubmit}
          >
            <img src={icons.submitChat} alt="send message" className="pointer-events-none" />
          </button>
        </div>
      </form>
    </div>
  );
}
