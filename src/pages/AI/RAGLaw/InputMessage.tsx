import { useAuthContext } from '@/auth';
import useRagLawHook from '@/hooks/useRagLawHook';
import { icons } from '@/theme/image';
import { useFormik } from 'formik';
import { useEffect } from 'react';

export default function InputMessage() {
  const {
    sendDataToSocket,
    formInput,
    handleSetFormInput,
    handleConnectWebSocket,
    handleDisconnectWebSocket,
    disabledSubmit
  } = useRagLawHook();
  const { currentUser } = useAuthContext();

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      sendDataToSocket();
    }
  });

  // TODO: socket to functions -> done
  useEffect(() => {
    handleConnectWebSocket();
    return () => {
      handleDisconnectWebSocket();
    };
  }, [currentUser]);

  return (
    <div className="relative grow mx-5 mb-2.5">
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          className="input h-auto py-4 px-6 pe-14 bg-transparent rounded-full"
          onChange={(e) => handleSetFormInput(e.target.value)}
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
