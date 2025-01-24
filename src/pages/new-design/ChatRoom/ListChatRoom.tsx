import { useFetchChatRooms } from '@/api/query/chatroom.query';
import {
  InputField,
  KeenIcon,
  MenuIcon,
  MenuLink,
  MenuSeparator,
  MenuSub,
  MenuTitle
} from '@/components';
import useAIModelHook from '@/hooks/useAIModelHook';
import { IChatRoom } from '@/interfaces/chat-room.interface';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useChatRoomDelete, useChatRoomUpdate } from '@/api/mutations/chatroom.mutation';
import { ModalConfirm } from '@/components/custom/ModelConfirm';
import { sliceText } from '@/utils';
import { icons } from '@/theme/image';
import clsx from 'clsx';

const ListChatRoom = () => {
  const { mutate: updateChatRoom } = useChatRoomUpdate();
  const { mutate: deleteChatRoom } = useChatRoomDelete();
  const [selectedDelete, setSelectedDelete] = useState<IChatRoom | null>(null);
  const { data: listChatRoom, isPending } = useFetchChatRooms();
  const { handleSetChatRoom, chatRoom } = useAIModelHook();
  const [indexRowEditing, setIndexRowEditing] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: null,
      name: ''
    },
    onSubmit: (values) => {
      if (!values.id) {
        console.error('no room id');
        return;
      }
      if (!values.name) {
        alert("Name chat room can't be empty");
        return;
      }
      updateChatRoom({
        id: values.id,
        name: values.name
      });
      console.log('form values:', values);
      setIndexRowEditing(null);
    }
  });

  function handleEdit(row: IChatRoom, index: number) {
    formik.setFieldValue('name', row.name);
    formik.setFieldValue('id', row.id);
    setIndexRowEditing(index);
  }

  function handleOpenConfirm(row: IChatRoom) {
    setSelectedDelete(row);
    setOpenModal(true);
  }

  function confirmDelete() {
    if (!selectedDelete) {
      console.error('no room selected');
      return;
    }
    deleteChatRoom({
      id: selectedDelete.id
    });
    setOpenModal(false);
  }

  const DropdownCrudItem = (index: number, row: IChatRoom) => {
    return (
      <MenuSub className="menu-default" rootClassName="w-full max-w-[175px]">
        <MenuItem
          onClick={() => {
            handleEdit(row, index);
          }}
        >
          <MenuLink>
            <MenuIcon>
              <KeenIcon icon="pencil" />
            </MenuIcon>
            <MenuTitle>Edit</MenuTitle>
          </MenuLink>
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          onClick={() => {
            handleOpenConfirm(row);
          }}
        >
          <MenuLink>
            <MenuIcon>
              <KeenIcon icon="trash" />
            </MenuIcon>
            <MenuTitle>Remove</MenuTitle>
          </MenuLink>
        </MenuItem>
      </MenuSub>
    );
  };
  const renderRow = (row: IChatRoom, index: number) => {
    return (
      <div key={index} className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-1 items-center justify-between flex-wrap gap-2">
          {indexRowEditing === index ? (
            <form onSubmit={formik.handleSubmit} noValidate className="flex flex-1">
              <div className="flex flex-1 items-center justify-between flex-wrap gap-2">
                <InputField {...formik.getFieldProps('name')} />
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-sm btn-icon btn-clear btn-primary">
                    <KeenIcon icon="archive-tick" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndexRowEditing(null)}
                    className="btn btn-sm btn-icon btn-clear btn-primary"
                  >
                    <KeenIcon className="text-red-500" icon="abstract-11" />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div
              className={clsx(
                'flex items-center gap-1.5 w-full p-2 pe-0 rounded-lg justify-between',
                {
                  'bg-gray-200': row.id === chatRoom?.chatRoomId
                }
              )}
            >
              <div className="flex items-center gap-1.5">
                <img
                  src={row.assistant.avatar_url || icons.aiAvatar}
                  className="size-7 rounded-full"
                  alt={row.assistant.name}
                />
                <p
                  data-toggle="tooltip"
                  title={row.name}
                  data-placement="top"
                  data-container="body"
                  className="text-sm font-normal text-gray-900 cursor-pointer"
                  onClick={() =>
                    handleSetChatRoom({
                      chatRoomId: row.id,
                      assistant: row.assistant
                    })
                  }
                >
                  {sliceText(row.name, 25)}
                </p>
              </div>

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
                  {DropdownCrudItem(index, row)}
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
      </div>
    );
  };
  if (isPending) {
    return <div> Tải xuống...</div>;
  }

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title">Lịch sử</h3>
      </div>

      <div className="card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4 flex-grow">
        <div className="grid gap-3 scrollable-y-auto max-h-[calc(100vh-420px)]">
          {listChatRoom?.map(renderRow)}
        </div>
      </div>
      <ModalConfirm
        title="Xác nhận xoá"
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        message="Bạn có chắc chắn muốn xoá?"
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export { ListChatRoom };
