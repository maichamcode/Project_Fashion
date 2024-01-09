import { Button, Popconfirm } from "antd";
import React from "react";
import { Link } from "react-router-dom";



const ListSizeDetail = ({ data }: any) => {
    return (
        <>
            <tr>
                <td>
                    <strong>{data?.size_id}</strong>
                </td>
                <td>
                    <strong>{data?.size_name}</strong>
                </td>
                {/* <td>
                    <div className="dropdown">
                        <Link to={`/admin/category/${data?.category_id}/update`}>
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
            </Popconfirm>
                    </div>
                </td> */}
            </tr>
        </>
    );
};

export default ListSizeDetail;
