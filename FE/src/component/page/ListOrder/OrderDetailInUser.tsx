import { useParams } from "react-router-dom"
import { useGetOneOrderQuery, useSendEmailStatusOrderMutation, useUpdateCancellMutation, useUpdateOrderDoneMutation } from "../../../api/order"
import { useEffect, useState } from "react"
import CurrencyFormatter from "../../../utils/FormatTotal"
import { useGetOneChekoutQuery } from "../../../api/checkout"
import DetailOrderInUser from "./DetailOrderInUser"
import { Button, message } from "antd"
import { useSumKhoMutation } from "../../../api/product"
import io from "socket.io-client";
const socket = io("http://localhost:8080");

const OrderDetailInUser = () => {
  const { id } = useParams()
  const { data: order, refetch } = useGetOneOrderQuery(id)
  useEffect(() => {
    socket.on("confirm", (data: any) => {
      messageApi.open({
        type: "success",
        content: data.message,
      });
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
  useEffect(() => {
    socket.on("shiping", (data: any) => {
      messageApi.open({
        type: "success",
        content: data.message,
      });
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
  useEffect(() => {
    socket.on("statusdone", (data: any) => {
      messageApi.open({
        type: "success",
        content: data.message,
      });
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
  useEffect(() => {
    socket.on("complete", (data: any) => {
      messageApi.open({
        type: "success",
        content: 'Đơn hàng hoàn thành',
      });
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
    const [check, setcheck] = useState(0);
    const [dulieu, setdulieu] = useState<any>();
    const [huy, sethuy] = useState<any>(false);
    const [color, setcolor] = useState<any>("process");
    const [nhan, setnhan] = useState<any>(false);
    const [checkbill, setcheckbill] = useState(false);


    const ngay = order?.data[0]?.order_date?.substring(1, 11);
    const gio = order?.data[0]?.order_date?.substring(12, 20);
    const [payment, setpayment] = useState<any>()
    useEffect(() => {
        if (order?.data[0]?.payment_status == 1) {
            setpayment('COD')
        } else {
            setpayment('VNPAY')
        }
    }, [order])
    let icons: any;
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
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(true);
      setcheck(0);
      sethuy(false);
      setnhan(true);
    } else if (order?.data[0]?.status == "2") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(false);
      setcheck(1);
      sethuy(true);
      setnhan(true);
    } else if (order?.data[0]?.status == "3") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(false);
      setcheck(2);
      sethuy(true);
      setnhan(true);
    } else if (order?.data[0]?.status == "4") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(false);
      setcheck(3);
      sethuy(true);
      setnhan(false);
    } else if (order?.data[0]?.status == "5") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(false);
      setcheck(4);
      sethuy(true);
      setnhan(true);
    } else if (order?.data[0]?.status == "6") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(false);
      setcheck(5);
      sethuy(true);
      setnhan(true);
    } else if (order?.data[0]?.status == "0") {
      setcheckbill(true);
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
      setnhan(true);
    } else {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setnhan(true);
    }
  }, [order, refetch]);
    const { data: checkout } = useGetOneChekoutQuery(order?.data[0]?.checkout_id)
    const user = JSON.parse(localStorage.getItem('user')!)
    const [sendEmail] = useSendEmailStatusOrderMutation();
    const [messageApi, TextHorder] = message.useMessage();
    const [status, setstatus] = useState<any>()
    const [css, setcss] = useState<any>()
    useEffect(() => {
        // Update status and css based on data.status
        if (order?.data[0]?.status == 1) {
            setstatus('Đã Đặt Hàng');
            setcss('primary');

        } else if (order?.data[0]?.status == 2) {
            setstatus('Đã Xác Nhận');
            setcss('info');

        } else if (order?.data[0]?.status == 3) {
            setstatus('Đang Giao Hàng');
            setcss('success');

        } else if (order?.data[0]?.status == 4) {
            setstatus('Đã Giao Hàng');
            setcss('success');

        } else if (order?.data[0]?.status == 5) {
            setstatus('Đã Nhận Hàng');
            setcss('success');

        } else if (order?.data[0]?.status == 6) {
            setstatus('Đã Hoàn Thành');
            setcss('success');

        } else {
            setstatus('Đã Hủy Hàng');
            setcss('danger');

        }
    }, [order?.data[0]?.status]);
    const [sumKho] = useSumKhoMutation()
    const [cancel] = useUpdateCancellMutation();
    const HandleCancellOrder = () => {
      const datas ={
        id: id,
        productId:checkout?.data?.product
      }
      console.log("test",datas);
    
      cancel(datas)
        .unwrap()
        .then((data: any) => {
          sendEmail(datas);
          messageApi.open({
            type: "success",
            content: "Bạn đã hủy đơn hàng này!",
          });
          let quantityMap: Record<string, number> = {};
  
          datas?.productId?.forEach((data:any) => {
            if (quantityMap[data.product_id] === undefined) {
              quantityMap[data.product_id] = data.quantity;
            } else {
              quantityMap[data.product_id] += data.quantity;
            }
          });
  
          Object.keys(quantityMap)?.forEach((id) => {
            const kho = {
              quantity: quantityMap[id],
              productId: id
            };
            sumKho(kho);
          });
          
        })
        .catch((error: any) => {
          messageApi.open({
            type: "error",
            content: error?.data?.message,
          });
        });
    };
    const [done] = useUpdateOrderDoneMutation();
  const HandleDoneOrder = async () => {
    const idorder = { id: id };
    done(idorder)
      .unwrap()
      .then(() => { })
      .catch((error: any) => {
        messageApi.open({
          type: "error",
          content: error?.data?.message,
        });
      });
  };
    return (
        <>
           {TextHorder}
            <section
                className="breadcrumb breadcrumb_bg"
                style={{ marginTop: "70px", backgroundColor: "#eeee" }}
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="breadcrumb_iner">
                                <div className="breadcrumb_iner_item">
                                    <h2>Thông tin đơn hàng</h2>
                                    <p>
                                        Home <span>-</span> Order Detail
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container-fluid order-detail-section">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center py-3">

                        <h2 className="h5 mb-0">
                            <a href="#" className="text-muted">
                                Đơn Hàng #{order?.data[0]?.order_id}
                            </a>
                        </h2>
                        <h5><a href="#" style={{color:"blue"}}>
                            {status ? status : ""}
                        </a></h5>
                    </div>
                    <div className="row">
                        <div >
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="mb-3 d-flex justify-content-between">
                                        <div>
                                            <span className="me-3">{ngay ? ngay : ""}</span>
                                            <span className="me-3">{gio ? gio : ""}</span>
                                            <span className="me-3">{payment ? payment : ""}</span>
                                        </div>
                                    </div>
                                    <table className="table table-borderless">
                                        <tbody>
                                            {checkout?.data?.product?.map((data: any) => <DetailOrderInUser data={data} />)}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={2}>Tổng Tiền</td>
                                                <td className="text-end">
                                                    <CurrencyFormatter amount={Number(order?.data[0]?.order_total)} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>Phí Vận Chuyển</td>
                                                <td className="text-end"><CurrencyFormatter amount="30000" /></td>
                                            </tr>
                                            <tr className="fw-bold">
                                                <td colSpan={2}>Thành Tiền</td>
                                                <td className="text-end">
                                                    {payment == "VNPAY" ? <CurrencyFormatter amount={0}/> : <CurrencyFormatter amount={Number(order?.data[0]?.order_total) + 30000} />}
                                                   
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <h3 className="h6">Phương thức thanh toán</h3>
                                            <p>{payment ? payment : ""}</p>
                                        </div>
                                        <div className="col-lg-6">
                                            <h3 className="h6">Địa chỉ nhận hàng</h3>
                                            <address>
                                                <strong>
                                                    {user ? `${user?.user?.user_lastname} ${user?.user?.user_firstname}` : ""}
                                                </strong>
                                                <br />
                                                {user ? `${user?.user?.user_phone}` : ""}
                                                <br />
                                                {checkout ? `${checkout?.data?.address}, ${checkout?.data?.ward}, ${checkout?.data?.district}, ${checkout?.data?.province}` : ""}
                                                <br />

                                            </address>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button disabled={huy} onClick={HandleCancellOrder}>
                Hủy Đơn Hàng
              </Button>
              <span> </span>
              <Button disabled={nhan} onClick={HandleDoneOrder} >
                Đã Nhận Được Hàng
              </Button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderDetailInUser