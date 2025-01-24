import { useFetchStagingCdps, useFetchStagingNkc } from '@/api/query/audit.query';
import { KeenIcon } from '@/components';
import { IStagingCdps, IStagingNkc } from '@/interfaces/audit/staging.interface';
import { formatNumberToCurrency } from '@/utils';

interface IInvoicingItem {
  so_tai_khoan: string;
  ten_tai_khoan: string;
  no_dau_ky: string;
  co_dau_ky: string;
  no_phat_sinh: string;
  co_phat_sinh: string;
  no_cuoi_ky: string;
  co_cuoi_ky: string;
}
interface IInvoicingItems extends Array<IInvoicingItem> {}

const StagingTable = () => {
  const { data: cdpsData } = useFetchStagingCdps();
  const { data: nkcData } = useFetchStagingNkc();

  const renderItemCDPS = (table: IStagingCdps, index: number) => {
    return (
      <tr key={index}>
        <td className="text-sm text-gray-800 font-normal">{table.year}</td>
        <td className="text-sm text-gray-800 font-normal">{table.account_number}</td>
        <td className="text-sm text-gray-700 font-normal lg:text-left">{formatNumberToCurrency(table.start_debt_money)}</td>
        <td className="text-sm text-gray-800 font-normal lg:text-left">
          {formatNumberToCurrency(table.start_debt_money)}
        </td>
        <td className="text-sm text-gray-700 font-normal lg:text-left">
          {formatNumberToCurrency(table.debt_arises_money)}
        </td>
        <td className="text-sm text-gray-800 font-normal lg:text-left">
          {formatNumberToCurrency(table.credit_arises_money)}
        </td>
        <td className="text-sm text-gray-700 font-normal lg:text-left">{formatNumberToCurrency(table.end_debt_money)}</td>
        <td className="text-sm text-gray-800 font-normal lg:text-left">
          {formatNumberToCurrency(table.end_credit_money)}
        </td>
        <td className="text-sm text-gray-700 font-normal lg:text-left">{table.document_id}</td>
      </tr>
    );
  };

  const renderItemNKC = (table: IStagingNkc, index: number) => {
    return (
      <tr key={index}>
        <td className="text-sm text-gray-800 font-normal">{table.account_debt}</td>
        <td className="text-sm text-gray-700 font-normal lg:text-left">{table.account_credit}</td>
        <td className="text-sm text-gray-800 font-normal lg:text-left">{formatNumberToCurrency(table.money)}</td>
        <td className="text-sm text-gray-700 font-normal lg:text-left">{table.receipt_number}</td>
        <td className="text-sm text-gray-800 font-normal lg:text-left">{table.description}</td>
        <td className="text-sm text-gray-700 font-normal lg:text-left">{table.document_id}</td>
      </tr>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Cân Đối Phát Sinh</h3>

          <button className="btn btn-light btn-sm">
            <KeenIcon icon="exit-down" />
            Download All
          </button>
        </div>
        <div className="card-table scrollable-x-auto max-h-[400px] overflow-y-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="min-w-10 text-left">Year</th>
                <th className="min-w-10">Số tài khoản </th>
                <th className="min-w-32 text-left">Nợ đầu kỳ</th>
                <th className="min-w-20 text-left">Có đầu kỳ</th>
                <th className="min-w-20 text-left">Nợ phát sinh</th>
                <th className="min-w-20 text-left">Có phát sinh</th>
                <th className="min-w-20 text-left">Nợ cuối kỳ</th>
                <th className="min-w-20 text-left">Có cuối kỳ</th>
                <th className="min-w-20 text-left">Document ID</th>
                
              </tr>
            </thead>
            <tbody>
              {cdpsData?.data.map((table, index) => {
                return renderItemCDPS(table, index);
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Nhật Ký Chung</h3>

          <button className="btn btn-light btn-sm">
            <KeenIcon icon="exit-down" />
            Download All
          </button>
        </div>
        <div className="card-table scrollable-x-auto max-h-[400px] overflow-y-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="min-w-10">Account Dept </th>
                <th className="min-w-32 text-left">Account Credit</th>
                <th className="min-w-20 text-left">Money</th>
                <th className="min-w-20 text-left">Receipt Number</th>
                <th className="min-w-20 text-left">Description</th>
                <th className="min-w-20 text-left">Document ID</th>
              </tr>
            </thead>
            <tbody>
              {nkcData?.data.map((table, index) => {
                return renderItemNKC(table, index);
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { StagingTable, type IInvoicingItem, type IInvoicingItems };
