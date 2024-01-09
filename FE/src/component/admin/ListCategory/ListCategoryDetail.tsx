import { Button, Popconfirm } from "antd";
import React from "react";
import { Link } from "react-router-dom";



const ListCategoryDetail = ({ data }: any) => {
  const imageArray = data?.image?.split(",");
  return (
    <>
      <tr>
        <td>
          <strong>{data?.category_id}</strong>
        </td>
        <td>
          <strong>{data?.category_name}</strong>
        </td>
        <td>
        <img src={imageArray} alt="Avatar" width={"200px"} />
        </td>
        <td>
          <div className="dropdown">
            <Link to={`/admin/category/${data?.category_id}/update`}>
              <button
                type="button"
                className="btn btn-outline-success"
                style={{ fontSize: "12px" }}
              >
                Sửa danh mục
              </button>
            </Link>
            <span> </span>
            {/* <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this book?"
              okText="Yes"
              cancelText="No"
              // onConfirm={() => handleRemove(data?.id)}
            >
              <Button
                className="btn btn-outline-danger"
                style={{ fontSize: "12px" }}
              >
                Delete
              </Button>
            </Popconfirm> */}
          </div>
        </td>
      </tr>
    </>
  );
};

export default ListCategoryDetail;
