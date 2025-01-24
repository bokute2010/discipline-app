import { useSavedPromptCreate } from '@/api/mutations';
import {
  KeenIcon,
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle
} from '@/components';
import { ModalSavedPrompt } from '@/components/custom/ModalSavedPrompt/ModalSavedPrompt';
import { RootState } from '@/redux/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface IMessageCardOutProps {
  text: string;
  time: string;
}

const MessageCardOut = ({ text, time }: IMessageCardOutProps) => {
  const { mutate: savedPrompt } = useSavedPromptCreate();
  const { chatRoom } = useSelector((state: RootState) => state.ai);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const onOpenModal = () => setOpenModal(true);
  const onCloseModal = () => setOpenModal(false);
  const onGetAssistantId = () => {
    return parseInt(localStorage.getItem('assistantId') || '');
  };

  function handleSavedPrompt(values: { title: string }) {
    let assistant_id = onGetAssistantId() || chatRoom?.assistant.id;

    if (!assistant_id) {
      return;
    }
    savedPrompt({
      title: values.title,
      content: text,
      assistant_id: assistant_id
    });
    setOpenModal(false);
  }
  return (
    <div className="flex items-end justify-end gap-3.5 px-5">
      <div className="flex flex-col gap-1.5">
        <div className="card shadow-none flex flex-row gap-2.5 p-3 rounded-br-none">
          <div
            className="text-2sm font-medium flex flex-row items-center"
            style={{ whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
          <Menu className="items-stretch">
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: 'bottom-end',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 10] // [skid, distance]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear mb-2.5-">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
              <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
                <MenuItem onClick={onOpenModal}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="archive-tick" />
                    </MenuIcon>
                    <MenuTitle>Save</MenuTitle>
                  </MenuLink>
                </MenuItem>
              </MenuSub>
            </MenuItem>
          </Menu>
        </div>

        <ModalSavedPrompt
          open={openModal}
          onClose={onCloseModal}
          title="Save Message"
          onConfirm={handleSavedPrompt}
          isWarning={false}
        />

        <div className="flex items-center justify-end rela  tive">
          <span className="text-2xs font-medium text-gray-600">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageCardOut;
