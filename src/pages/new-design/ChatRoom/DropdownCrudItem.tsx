import {
  KeenIcon,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSeparator,
  MenuSub,
  MenuTitle
} from '@/components';
import { IChatRoom } from '@/interfaces/chat-room.interface';

interface DropdownCrudItemProps {
  index: number;
  row: IChatRoom;
  // eslint-disable-next-line no-unused-vars
  onEdit: (row: IChatRoom, index: number) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (row: IChatRoom) => void;
}

const DropdownCrudItem = ({ index, row, onEdit, onDelete }: DropdownCrudItemProps) => {
  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[175px]">
      <MenuItem onClick={() => onEdit(row, index)}>
        <MenuLink>
          <MenuIcon>
            <KeenIcon icon="pencil" />
          </MenuIcon>
          <MenuTitle>Edit</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuSeparator />
      <MenuItem onClick={() => onDelete(row)}>
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
export default DropdownCrudItem;
