import { Link } from 'react-router-dom';

import {
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
import { toAbsoluteUrl } from '@/utils/Assets';

import { useFetchDocuments } from '@/api/query/audit.query';
import { IDocument } from '@/interfaces/audit/document.interface';
import moment from 'moment';
import { useGeneratePresignedUrlRead } from '@/api/mutations/file.mutation';
import { getKeyS3FromUrl } from '@/utils';

interface IRecentUploadsItem {
  image: string;
  desc: string;
  date: string;
}
interface IRecentUploadsItems extends Array<IRecentUploadsItem> {}

interface IRecentUploadsProps {
  title: string;
}

const RecentUploads = ({ title }: IRecentUploadsProps) => {
  const { data: documents } = useFetchDocuments();
  const { mutate: generatePresignUrl } = useGeneratePresignedUrlRead();

  function handleDownloadFile(file: IDocument) {
    const key = getKeyS3FromUrl(file.url);
    if (!key) {
      return;
    }
    generatePresignUrl({ key });
  }

  const renderItem = (item: IDocument, index: number) => {
    return (
      <div key={index} className="flex items-center gap-3">
        <div className="flex items-center grow gap-2.5">
          <img src={toAbsoluteUrl(`/media/file-types/${item.type}.svg`)} alt="" />

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 cursor-pointer hover:text-primary mb-px">
              {item.name}
            </span>
            <span className="text-xs text-gray-700">{moment(item.created_at).format('LL')}</span>
          </div>
        </div>
        <div>
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
                <MenuItem onClick={() => handleDownloadFile(item)}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="file-down" />
                    </MenuIcon>
                    <MenuTitle>Tải xuống</MenuTitle>
                  </MenuLink>
                </MenuItem>
                {/* <MenuSeparator />
                <MenuItem
                  onClick={() => {
                    // handleOpenDeleteModal(info.row.original);
                  }}
                >
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="trash" />
                    </MenuIcon>
                    <MenuTitle>Xoá</MenuTitle>
                  </MenuLink>
                </MenuItem> */}
              </MenuSub>
            </MenuItem>
          </Menu>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>

      <div className="card-body">
        <div className="grid gap-2.5 lg:gap-5 max-h-[550px] overflow-y-scroll">
          {documents &&
            documents.data.map((item, index) => {
              return renderItem(item, index);
            })}
        </div>
      </div>
    </div>
  );
};

export {
  RecentUploads,
  type IRecentUploadsItem,
  type IRecentUploadsItems,
  type IRecentUploadsProps
};
