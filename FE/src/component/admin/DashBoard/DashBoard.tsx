import { useEffect, useState } from "react";
import { useGetTopProductSaleQuery } from "../../../api/product";
import TopProductSale from "./TopProductSale";
import Topuser from "./Topuser";
import {
  useGetTotalDayQuery,
  useGettopuserQuery,
  useTopProductDayQuery,
  useTopProductMonthQuery,
  useTopProductWeekQuery,
} from "../../../api/dashboard";
import Top1Product_Day_Week_Month from "./Top1Product_Day_Week_Month";
// import TopProductRenevue from "./TopRenevueProduct";
import PaymentChart from "./PaymentChart";
import CategoryChart from "./CategoryChart";
import OrderDay from "./OrderDay";
import DataDay from "./DataDay";
import ProductChart from "./ProductChart";
import Order30DayChart from "./Order30DayChart";
import Top1ProductSelect from "./Top1ProductSelect";
const DashBoard = () => {
  const { data: totalday } = useGetTotalDayQuery("");
  const [totaldays, settotaldays] = useState<any>();
  useEffect(() => {
    if (totalday?.data?.total_amount_day == null) {
      settotaldays(0);
    } else {
      settotaldays(totalday?.data?.total_amount_day);
    }
  }, [totalday?.data?.total_amount_day]);
  const { data: productsale } = useGetTopProductSaleQuery("");
  const [total, setTotal] = useState(0);
  const { data: topuser } = useGettopuserQuery("");
  const HandleTotal = (totalss: any) => {
    const totalToAdd = parseFloat(totalss);
    if (!isNaN(totalToAdd)) {
      setTotal((prevTotal) => prevTotal + totalToAdd);
    }
  };

  const [count, setCount] = useState(0);
  let counts = 0;
  const HandleCount = (countt: any) => {
    counts += countt;
    setCount(counts);
  };
  //select
  const { data: topProductDay } = useTopProductDayQuery("");
  const { data: topProductWeek } = useTopProductWeekQuery("");
  const { data: topProductMonth } = useTopProductMonthQuery("");
  const [selectedOption, setSelectedOption] = useState("Theo Ngày");
  // Lưu trữ sản phẩm hàng đầu tùy thuộc vào tùy chọn đã chọn
  const [topProducts, setTopProducts] = useState([]);
  useEffect(() => {
    if (selectedOption === "Theo Ngày" && topProductDay) {
      if (topProductDay?.data?.length > 0) {
        setTopProducts(topProductDay);
      } else {
        setTopProducts(topProductWeek);
        setSelectedOption("Theo Tuần")
      }

    } else if (selectedOption === "Theo Tuần" && topProductWeek) {
      // Cập nhật topProducts cho Theo Tuần
      setTopProducts(topProductWeek);
    } else if (selectedOption === "Theo Tháng" && topProductMonth) {
      // Cập nhật topProducts cho Theo Tháng
      setTopProducts(topProductMonth);
    }
  }, [selectedOption, topProductDay, topProductWeek, topProductMonth]);
  // console.log(topProducts);
  //end select
  return (
    <>
      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row">
            <div style={{ display: "flex" }}>
              <div className="col-lg-8 mb-4 order-0">
                <DataDay />
              </div>
              <div className="col-lg-4 col-md-4 order-1">
                <div className="row" style={{ display: "flex" }}>
                  <div className="col-6 mb-4">
                    <div className="card">
                      <PaymentChart />
                    </div>
                  </div>
                  <div className="col-6 mb-4">
                    <div className="card">
                      <CategoryChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div className="col-lg-8 mb-4 order-0">
                <OrderDay />
              </div>
              <div className="col-lg-4 col-md-4 order-1">
                <Order30DayChart />
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ width: "100%" }}>
                <ProductChart />
              </div>
            </div>
          </div>
          <div className="row">


            <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-4" >
              <div className="card " style={{ width: "580px", minHeight: '300px' }}>
                <div className="card-header d-flex align-items-center justify-content-between pb-0" >
                  <div className="card-title mb-0">
                    <h5 className="m-0 me-2">Sản Phẩm Bán Chạy</h5>

                  </div>
                  <Top1ProductSelect
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                  />
                </div>

                <Top1Product_Day_Week_Month
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  topProducts={topProducts}
                />
              </div>
            </div>


            <div className="card h-100" style={{ width: "580px", marginLeft: "210px", padding: 0, minHeight: '300px' }}>
              <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="card-title m-0 me-2">Top người dùng</h5>

              </div>
              <div className="card-body" >
                <ul className="p-0 m-0" >
                  {topuser?.data?.map((data: any) => (
                    <Topuser data={data} />
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

        <div className="content-backdrop fade"></div>
      </div>
    </>
  );
};

export default DashBoard;
