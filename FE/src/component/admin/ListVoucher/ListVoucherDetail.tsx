import { Button, Popconfirm, message } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useDeleteVoucherMutation } from "../../../api/voucher";
import CurrencyFormatter from "../../../utils/FormatTotal";

const ListVoucherDetail = ({ data }: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [deleteVoucher] = useDeleteVoucherMutation();

  const HandleVoucher = () => {
    const voucherId = data?.voucher_id;
    deleteVoucher(voucherId)
      .unwrap()
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Xóa thành công",
        });
      });
  };

  return (
    <>
      <tr>
        <td>
          <strong>{data?.voucher_id}</strong>
        </td>
        <td>
          <strong>{data?.voucher_code}</strong>
        </td>
        <td>
          <strong>
            <CurrencyFormatter amount={data?.voucher_amount} />
          </strong>
        </td>
        <td>
          <span className="badge bg-label-primary me-1">
            {data?.voucher_status}
          </span>
        </td>
        <td>
          <div className="dropdown">
            <Link to={`/admin/voucher/${data?.voucher_id}/update`}>
              <button
                type="button"
                className="btn btn-outline-success"
                style={{ fontSize: "12px" }}
              >
                Sửa
              </button>
            </Link>
            <span> </span>
            <Popconfirm
              title="Xóa Voucher"
              description="Bạn có muốn xóa không?"
              okText="Yes"
              cancelText="No"
              onConfirm={HandleVoucher}
            >
              <Button
                className="btn btn-outline-danger"
                style={{ fontSize: "12px" }}
              >
                Xoá
                {contextHolder}
              </Button>
            </Popconfirm>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ListVoucherDetail;
