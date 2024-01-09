import { Button, Result } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetOneOrderQuery } from "../../../api/order";
import io from 'socket.io-client';
const socket = io('http://localhost:8080');
const OrderSucces = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")!);
  const token = user?.accessToken;
  const { data: order, refetch } = useGetOneOrderQuery(id);
  const [check, setcheck] = useState(0);
  const [huy, sethuy] = useState<any>(false);
  const [nhan, setnhan] = useState<any>(false);
  const [dulieu, setdulieu] = useState<any>();
  const [color, setcolor] = useState<any>("process");
  const [status, setstatus] = useState<any>();
  const [checkbill, setcheckbill] = useState(false);
  const [title, settitle] = useState<any>()
  let icons: any;
  useEffect(() => {
    socket.on('confirm', (data: any) => {
      console.log(data);
      alert(data.message);
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
  useEffect(() => {
    if (order?.data[0]?.status == "1") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đã Nhận Hàng",
        },
      ];
      setdulieu(icons);
      setcheckbill(true)
      setcheck(0);
      sethuy(false);
      setnhan(false);
      settitle('Bạn Đã Đặt Hàng Thành Công!')
    } else if (order?.data[0]?.status == "2") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đã Nhận Hàng",
        },
      ];
      setdulieu(icons);
      setcheckbill(false)
      setcheck(1);
      sethuy(true);
      setnhan(true);
      setstatus("warning");
      settitle('Đơn Hàng Của Bạn Đã Được Xác Nhận!')
    } else if (order?.data[0]?.status == "3") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đã Nhận Hàng",
        },
      ];
      setdulieu(icons);
      setcheckbill(false)
      setcheck(2);
      sethuy(true);
      setnhan(false);
      setstatus("success");
      settitle('Bạn Đã Nhận Hàng Thành Công. Vui lòng để lại 1 đánh giá!')
    } else if (order?.data[0]?.status == "0") {
      setcheckbill(true)
      settitle('Đơn Hàng Của Bạn Đã Hủy!')
      icons = [
        {
          title: "Đã Hủy",
        },
        {
          title: "",
        },
        {
          title: "",
        },
      ];
      sethuy(true);
      setdulieu(icons);
      setcolor("error");
      setstatus("error");
    } else {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đã Nhận Hàng",
        },
      ];
      setdulieu(icons);
    }
  }, [order]);
  return (
    <>
      <div className="container mt-4 mb-4">
        <div className="row d-flex cart align-items-center justify-content-center">
          <div className="col-md-10" style={{ marginTop: "100px" }}>
            <div className="card">

              <div className="row g-0">
                <Result
                  status={status}
                  title={title}

                  extra={[
                    <Link to='/'>
                      <Button type="primary" key="console">
                        Trang chủ
                      </Button></Link>,
                    <Link to={`/orderdetail/${id}`}>
                      <Button key="buy">Xem chi tiết đơn hàng</Button>
                    </Link>,

                  ]}
                />
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSucces;
