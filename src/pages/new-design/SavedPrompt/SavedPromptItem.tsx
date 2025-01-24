import { useSavedPromptDelete } from '@/api/mutations';
import { InputField, KeenIcon } from '@/components';
import { ModalConfirm } from '@/components/custom/ModelConfirm';
import useSavedPromptlHook from '@/hooks/useSavedPrompt.hook';
import { ISavedPromptItem } from '@/interfaces/saved-prompt.interface';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
interface ISavedPromptItemProps {
  item: ISavedPromptItem;
}

const SavedPromptItem = ({ item }: ISavedPromptItemProps) => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: deleteSavedPrompt, isPending: isPendingDelete } = useSavedPromptDelete();
  const { navigateToChatRoom } = useSavedPromptlHook();
  const formik = useFormik({
    initialValues: {
      content: item.content
    },
    onSubmit: (values) => {
      if (!values.content) {
        toast.warn("Content can't be empty");
        return;
      }
      setIsEditing(false);
      console.log('form values:', values);
    }
  });
  function handleCancelEdit() {
    setIsEditing(false);
    formik.resetForm();
  }

  function handleConfirmDelete() {
    deleteSavedPrompt({ id: item.id });
    setOpenConfirmDelete(false);
  }

  function handleClickPrompt() {
    navigateToChatRoom(item.content, item.assistant);
  }
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-1 items-center justify-between flex-wrap gap-2 ">
        {isEditing ? (
          <form onSubmit={formik.handleSubmit} noValidate className="flex flex-1">
            <div className="flex flex-1 items-center justify-between flex-wrap gap-2">
              <InputField {...formik.getFieldProps('content')} />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="archive-tick" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-sm btn-icon btn-clear btn-primary"
                >
                  <KeenIcon className="text-red-500" icon="abstract-11" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <>
            <p
              className="text-sm font-normal text-gray-900 cursor-pointer"
              onClick={handleClickPrompt}
            >
              <span className="text-green-900 font-bold">{`[${item.assistant.name}]`}</span>
              {' - '}
              {item.content}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-sm btn-icon btn-icon-lg btn-clear btn-light"
              >
                <KeenIcon icon="pencil" className="cursor-pointer" />
              </button>
              <button
                onClick={() => setOpenConfirmDelete(true)}
                className="btn btn-sm btn-icon btn-icon-lg btn-clear btn-light"
              >
                <KeenIcon icon="trash" className="cursor-pointer" />
              </button>
            </div>
          </>
        )}

        <ModalConfirm
          open={openConfirmDelete}
          onClose={() => {
            setOpenConfirmDelete(false);
          }}
          title="Delete Prompt"
          message="Are you sure you want to delete this prompt?"
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export { SavedPromptItem };
