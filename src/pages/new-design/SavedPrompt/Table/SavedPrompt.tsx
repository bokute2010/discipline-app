/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import {
  DataGrid,
  KeenIcon,
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSeparator,
  MenuSub,
  MenuTitle,
  MenuToggle
} from '@/components';

import { useFetchSavedPrompt } from '@/api/query';
import { IPayloadUpdate, ISavedPromptItem } from '@/interfaces/saved-prompt.interface';
import { ModalConfirm } from '@/components/custom/ModelConfirm';
import { useSavedPromptDelete, useSavedPromptUpdate } from '@/api/mutations';
import useSavedPromptlHook from '@/hooks/useSavedPrompt.hook';
import { ModalSavedPromptEdit } from '@/components/custom/ModalEditSavedPrompt';
import moment from 'moment';

const SavedPrompts = () => {
  const storageFilterId = 'members-filter';
  const { data: listSavedPrompt, isLoading } = useFetchSavedPrompt();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const onOpenModalDelete = () => setOpenModalDelete(true);
  const onCloseModalDelete = () => setOpenModalDelete(false);
  const onOpenModalEdit = () => setOpenModalEdit(true);
  const onCloseModalEdit = () => setOpenModalEdit(false);
  const [selectedPrompt, setSelectedPrompt] = useState<ISavedPromptItem | null>(null);


  const { mutate: updateSavedPrompt, isPending: isPendingEdit } = useSavedPromptUpdate();
  const { mutate: deleteSavedPrompt, isPending: isPendingDelete } = useSavedPromptDelete();
  const { navigateToChatRoom } = useSavedPromptlHook();

  function handleOpenEditModal(prompt: ISavedPromptItem) {
    setSelectedPrompt(() => {
      onOpenModalEdit(); // Ensure this runs during the state update
      return prompt;
    });
  
  }

  function handleConfirmEdit(updateData: IPayloadUpdate) {
    if (!selectedPrompt) return;
    updateSavedPrompt(updateData);
    onCloseModalEdit();
  }

  function handleOpenDeleteModal(prompt: ISavedPromptItem) {
    setSelectedPrompt(prompt);
    onOpenModalDelete();
  }

  

  function handleConfirmDelete() {
    if (!selectedPrompt) return;
    deleteSavedPrompt({ id: selectedPrompt?.id });
    onCloseModalDelete();
    setSelectedPrompt(null); 
  }
  function handleRunPrompt(item: ISavedPromptItem) {
    localStorage.setItem('assistantId', item.assistant.id.toString());
    navigateToChatRoom(item.content,
      item.assistant
    );
  }



  const columns = useMemo<ColumnDef<ISavedPromptItem>[]>(
    () => [
      {
        accessorFn: (row) => row.title,
        id: 'title',
        header: () => 'Title',
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <a
                className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
                href="#"
              >
                {info.row.original.title}
              </a>
            </div>
          </div>
        )
      },
      {
        accessorFn: (row) => row.assistant.name,
        id: 'assistant',
        header: () => 'Assistant',
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <img
              src={info.row.original.assistant.avatar_url}
              className="size-7 rounded-full"
              alt=""
            />
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.assistant.name}
            </span>
          </div>
        )
      },
      {
        id: 'prompt',
        header: () => 'Prompt',
        enableSorting: false,
        cell: (info) => {
          return info.row.original.content;
        },
        meta: {
          className: 'min-w-[300px]'
        }
      },
      {
        accessorFn: (row) => row.created_at,
        id: 'created_at',
        enableSorting: true,
        header: () => 'Ngày tạo',
        cell: (info) => {
          const date = info.row.original.created_at
          return moment.utc(date).local().format('DD/MM/yyyy, h:mm A');
        },
        meta: {
          className: 'w-[200px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        id: 'click',
        header: () => '',
        enableSorting: false,
        cell: (info) => (
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
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
              <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
              <MenuItem onClick={() => handleRunPrompt(info.row.original)}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="rocket" />
                    </MenuIcon>
                    <MenuTitle>Run</MenuTitle>
                  </MenuLink>
                </MenuItem>
                <MenuItem onClick={() => handleOpenEditModal(info.row.original)}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="pencil" />
                    </MenuIcon>
                    <MenuTitle>Edit</MenuTitle>
                  </MenuLink>
                </MenuItem>
                <MenuSeparator />
                <MenuItem onClick={()=>{handleOpenDeleteModal(info.row.original)}}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="trash" />
                    </MenuIcon>
                    <MenuTitle>Delete</MenuTitle>
                  </MenuLink>
                </MenuItem>
                
              </MenuSub>
            </MenuItem>
          </Menu>
        ),
        meta: {
          className: 'w-[60px]'
        }
      }
    ],
    []
  );

  // Memoize the team data
  const data: ISavedPromptItem[] = useMemo(() => listSavedPrompt || [], [listSavedPrompt]);

  // Initialize search term from localStorage if available
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem(storageFilterId) || '';
  });

  // Update localStorage whenever the search term changes
  useEffect(() => {
    localStorage.setItem(storageFilterId, searchTerm);
  }, [searchTerm]);

  // Filtered data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data; // If no search term, return full data

    return data.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.assistant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  return (
    <div className="card card-grid min-w-full">
      <div className="card-header py-5 flex-wrap gap-2">
        <h3 className="card-title">Saved Prompts</h3>

        <div className="flex gap-6">
          <div className="relative">
            <KeenIcon
              icon="magnifier"
              className="leading-none text-md text-gray-500 absolute top-1/2 left-0 -translate-y-1/2 ml-3"
            />
            <input
              type="text"
              placeholder="Search prompt title or assistant"
              className="input input-sm pl-8 min-w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
          </div>
        </div>
      </div>

      <div className="card-body">
        <DataGrid
          columns={columns}
          data={filteredData}
          rowSelect={false}
          paginationSize={10}
          initialSorting={[{ id: 'title', desc: false }]}
          saveState={true}
          saveStateId="members-grid"
        />
      </div>

      <ModalConfirm
        open={openModalDelete}
        title="Xóa quy trình"
        message="Bạn có chắc chắn muốn xóa quy trình này không?"
        onClose={onCloseModalDelete}
        onConfirm={handleConfirmDelete}
      />
      <ModalSavedPromptEdit
        open={openModalEdit}
        title="Edit Prompt"
        onClose={onCloseModalEdit}
        onConfirm={handleConfirmEdit}
        savedPrompt={selectedPrompt}
      />
    </div>
  );
};

export { SavedPrompts };
