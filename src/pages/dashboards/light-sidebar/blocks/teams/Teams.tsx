/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { DataGrid, KeenIcon, TDataGridSelectedRowIds } from '@/components';
import { CommonAvatars, CommonRating } from '@/partials/common'; // Import avatar-related types and components
import { TeamsData, ITeamData } from './';

const Teams = () => {
  const { enqueueSnackbar } = useSnackbar();
  const storageFilterId = 'teams-filter';

  const columns = useMemo<ColumnDef<ITeamData>[]>(
    () => [
      {
        accessorFn: (row) => row.team.name,
        id: 'team',
        header: () => 'Team',
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="flex flex-col gap-2">
              <Link
                className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
                to="#"
              >
                {info.row.original.team.name}
              </Link>
              <span className="text-2sm text-gray-700 font-normal leading-3">
                {info.row.original.team.description}
              </span>
            </div>
          );
        },
        meta: {
          className: 'min-w-[280px]'
        }
      },
      {
        accessorFn: (row) => row.rating.value,
        id: 'rating',
        header: () => 'Rating',
        enableSorting: true,
        cell: (info) => (
          <CommonRating
            rating={info.row.original.rating.value}
            round={info.row.original.rating.round}
          />
        ),
        meta: {
          className: 'min-w-[135px]'
        }
      },
      {
        accessorFn: (row) => row.lastModified,
        id: 'lastModified',
        enableSorting: true,
        header: () => 'Last Modified',
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[135px]'
        }
      },
      {
        accessorFn: (row) => row.members,
        id: 'members',
        header: () => 'Members',
        enableSorting: true,
        cell: (info) => (
          <CommonAvatars
            size="size-[30px]"
            group={info.row.original.members.group}
            more={info.row.original.members.more}
          />
        ),
        meta: {
          className: 'min-w-[135px]'
        }
      }
    ],
    []
  );

  // Memoize the team data
  const data: ITeamData[] = useMemo(() => TeamsData, []);

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
      (team) =>
        team.team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.team.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  // Handler for sorting changes
  const handleRowsSelectChange = (selectedRowIds: TDataGridSelectedRowIds) => {
    enqueueSnackbar(
      selectedRowIds.size > 0 ? `${selectedRowIds.size} rows selected` : `No rows are selected`,
      { 
        variant: 'solid', 
        state: 'dark'
      }
    );
  };

  return (
    <div className="card card-grid h-full min-w-full">
      <div className="card-header">
        <h3 className="card-title">Teams</h3>
        <div className="input input-sm max-w-48">
          <KeenIcon icon="magnifier" />
          <input
            type="text"
            placeholder="Search Teams"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
        </div>
      </div>

      <div className="card-body">
        <DataGrid 
          cellsBorder={true}
          columns={columns} 
          data={filteredData} 
          rowSelect={true} 
          onRowsSelectChange={handleRowsSelectChange}
          initialSorting={[{ id: 'team', desc: false }]} 
          saveState={true} 
          saveStateId='teams-grid'
        />
      </div>
    </div>
  );
};

export { Teams };