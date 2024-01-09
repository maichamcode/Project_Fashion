import { EyeOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const ListBillDetail = ({ data }: any) => {
  console.log(data);

  return (
    <>
      <tr>
        <td>
          <strong>{data?.id}</strong>
        </td>
        <td>
          <strong>{data?.order_id}</strong>
        </td>
        <td>
          <strong>{data?.user_phone}</strong>
        </td>
        <td>
          <strong>{data?.province}</strong>
        </td>
        <td>
          <strong>{data?.district}</strong>
        </td>
        <td>
          <strong>{data?.ward}</strong>
        </td>
        <td>
          <strong>{data?.address}</strong>
        </td>

        <td>
          <div className="dropdown">
            <Link to={`/admin/bill/${data?.bill_id}/update`}>
              <button
                type="button"
                className="btn btn-outline-success"
                style={{ fontSize: "12px" }}
              >
                Sửa
              </button>
            </Link>
            <span> </span>
          </div>
        </td>
        <td style={{ width: "11.1%", fontSize: "13px" }}>
          <Link to={`/${data?.order_id}/bill`}>
            <EyeOutlined
              style={{ color: "blue", fontWeight: "bold", fontSize: "1.5em" }}
            />
          </Link>
        </td>
      </tr>
    </>
  );
};

export default ListBillDetail;
