import FileInput from '@/components/file-input/FileInput';
import { icons } from '@/theme/image';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import useAuditProcessHook from '@/hooks/useAuditProcessHook';
import { useLocation, useNavigate } from 'react-router';
import { useAuthContext } from '@/auth';

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
  // TODO: need to put the callbacks into separate functions with name so it's clear what => done
  const { currentUser } = useAuthContext();
  const location = useLocation();
  const navigation = useNavigate();
  const {
    newChatRoom,
    sendDataToSocketInNewRoom,
    listFile,
    handleSetListFile,
    formInput,
    handleSetFormInput,
    handleConnectWebSocket,
    handleDisconnectWebSocket,
    disabledSubmit,
    createChatRoom,
    handleSendIntroPrompt
  } = useAuditProcessHook();

  useEffect(() => {
    if (introPrompt) {
      handleSendIntroPrompt(assistant_id, introPrompt);
      setIntroPrompt && setIntroPrompt('');
    }
  }, [introPrompt]);

  const formik = useFormik({
    initialValues: {
      files: [] as File[]
    },
    onSubmit: (values) => {
      console.log('Uploaded files:', values.files);
      sendDataToSocketInNewRoom(assistant_id);
    }
  });

  const handleFormInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSetFormInput(event.target.value);
  };

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files ? Array.from(event.currentTarget.files) : [];
    formik.setFieldValue('files', files);
    handleSetListFile(
      files.map((file) => ({
        name: file.name.replace(/\s/g, '_'),
        file: file
      }))
    );
  }

  // TODO; separate websocket logic into functions for easy unit test
  useEffect(() => {
    if (!newChatRoom) return;
    handleConnectWebSocket(true);

    return () => {
      if (!newChatRoom) return;
      handleDisconnectWebSocket();
      console.log('disconnecting websocket');
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
    <div className="relative grow mb-2.5">
      <div className="flex flex-wrap gap-2.5 mx-5 my-2">
        {listFile.map((file, index) => (
          <div key={index} className="flex items-center gap-2.5 bg-gray-100 rounded-full px-3 py-1">
            <p className="text-sm text-gray-500">{file.name}</p>
          </div>
        ))}
      </div>
      <div className="relative grow mx-5 mb-2.5">
        <form onSubmit={formik.handleSubmit}>
          <FileInput name="files" handleFileChange={handleFileChange} disabled={disabledSubmit} />

          <input
            type="text"
            className="input h-auto py-4 ps-12 pe-16 bg-transparent rounded-full"
            onChange={handleFormInput}
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
    </div>
  );
}
