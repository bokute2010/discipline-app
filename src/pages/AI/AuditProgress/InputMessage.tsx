import FileInput from '@/components/file-input/FileInput';
import { icons } from '@/theme/image';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';

import { useAuthContext } from '@/auth';

import useAuditProcessHook from '@/hooks/useAuditProcessHook';
import useAIModelHook from '@/hooks/useAIModelHook';

export default function InputMessage() {
  const {
    handleSendWebSocketMessage,
    hasSocketJoined,
    listFile,
    handleSetListFile,
    formInput,
    handleSetFormInput,
    sendDataToSocket,
    handleConnectWebSocket,
    handleDisconnectWebSocket,
    disabledSubmit,
  } = useAuditProcessHook();

  const { chatRoom } = useAIModelHook();
  const { currentUser } = useAuthContext();

  const formik = useFormik({
    initialValues: {
      files: [] as File[]
    },
    onSubmit: (values) => {
      console.log('Uploaded files:', values.files);
      sendDataToSocket();
    }
  });

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

  useEffect(() => {
    handleConnectWebSocket();
    return () => {
      handleDisconnectWebSocket();
      console.log('disconnecting websocket');
    };
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && hasSocketJoined.current && chatRoom?.chatRoomId) {
      handleSendWebSocketMessage({
        action: 'get_audit_chat_history',
        user_id: currentUser.cognito_subject_id,
        chat_room_id: chatRoom?.chatRoomId
      });
    }
  }, [chatRoom?.chatRoomId]);

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
            onChange={(e) => handleSetFormInput(e.target.value)}
            placeholder="Write a message..."
            value={formInput}
            disabled={disabledSubmit}
          />

          <div className="flex items-center gap-2.5 absolute right-3 top-1/2 -translate-y-1/2">
            <button type="submit" className="cursor-pointer hover:scale-150" disabled={disabledSubmit}>
              <img src={icons.submitChat} alt="send message" className="pointer-events-none" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
