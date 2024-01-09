import { Button, Skeleton, Modal, Space } from "antd";
import { useGetAllProductOffQuery } from "../../../api/product";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  CalendarOutlined,
  PercentageOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useGetFlashSaleQuery, useGetSaleQuery } from "../../../api/sale";
import ListFlashSaleDetail from "./FlashSaleDetail";
import UpdateFlashSale from "./UpdateFlastSale";
import { useGetAllCatQuery } from "../../../api/category";
const socket = io("http://localhost:8080");

const ListFlashSale = () => {
  const { data: sale } = useGetSaleQuery("");
  const [showRevenue, setShowRevenue] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    console.log("okok");
    setIsModalOpen(true);
    console.log(isModalOpen);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const { data: category, isLoading, refetch } = useGetAllCatQuery("");
  useEffect(() => {
    socket.on("updatesale", (data: any) => {
      // console.log(data);

      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
  const [check, setcheck] = useState<any>();
  const [id, setid] = useState<any>();
  const HandleClick = (id: any) => {
    setcheck(true);
    setid(id);
    // return
  };
  const handelcheck = (data: any) => {
    setcheck(data);
  };
  const { data: flashsale, isLoading:flashing, refresh }: any = useGetFlashSaleQuery("");
  const refreshs = (data: any) => {
    refresh(data);
  }
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        
        <div className="card">
          <h5 className="card-header">Quản lý Flash Sale</h5>
        
          {check ? (
            <UpdateFlashSale id={id} onCheck={handelcheck} />
          ) : (
            <Modal open={isModalOpen} onCancel={handleCancel} width={500}>
              <Space direction="vertical">
                <div className="doanhthu" style={{ top: "-50px" }}>
                  <h4>Danh sách loại giảm giá:</h4>
                  <table className="table" style={{ marginLeft: "40px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>Tên hình thức giảm giá</th>
                        <th>Số % giảm</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {sale?.data?.map((data: any) => (
                        <tr>
                          <td>{data?.sale_name}</td>
                          <td>{data?.sale_distcount}%</td>
                          {/* Các cột khác nếu cần */}
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-success"
                              style={{ fontSize: "12px" }}
                              onClick={() => HandleClick(data?.sale_id)}
                            >
                              Sửa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Space>
            </Modal>
          )}

          <div className="table-responsive text-nowrap">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Mã danh mục</th>
                  <th>Tên danh mục</th>
                  <th>Thời gian bắt đầu</th>
                  <th>Thời gian kết thúc</th>
                  <th>Chọn sale</th>
                  <th></th>
                </tr>
              </thead>
              {isLoading ? (
                <Skeleton />
              ) : (
                <>
                  <tbody className="table-border-bottom-0">
                    {category?.data.map((data: any) => {
                      const sales = flashsale?.data?.find(
                        (data1: any) => data1?.category_id == data?.category_id
                      )?.category_id;
                      return (
                        <ListFlashSaleDetail
                          key={data?.category_id}
                          sales={sales}
                          data={data}
                          onFlashsale={refreshs}
                        />
                      );
                    })}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListFlashSale;
