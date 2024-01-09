import React, { useEffect, useState } from "react";
import {

    useTopProductRenevueDayQuery,
    useTopProductRenevueMonthQuery,
    useTopProductRenevueWeekQuery,
} from "../../../api/dashboard";
import { useGetOneProductQuery } from "../../../api/product";

const TopProductRenevue = () => {
    const { data: topProductDay } = useTopProductRenevueDayQuery("");
    //
    const { data: topProductWeek } = useTopProductRenevueWeekQuery("");
    //
    const { data: topProductMonth } = useTopProductRenevueMonthQuery("");

    //day
    let idProduct = null;
    let total = null;
    if (topProductWeek && topProductDay?.data) {
        const topProductData = topProductDay.data;
        if (topProductData.length > 0) {
            idProduct = topProductData[0].product_id;
            total = topProductData[0].total_count;
        }
    }
    const { data: getOneProduct } = useGetOneProductQuery(idProduct);
    const imageArray = getOneProduct?.data[0]?.image[0]?.split(",");
    //end day
    //week
    let idProductWeek = null;
    let totalWeek = null;
    if (topProductWeek && topProductWeek?.data) {
        const topProductData = topProductWeek.data;
        if (topProductData.length > 0) {
            idProductWeek = topProductData[0].product_id;
            totalWeek = topProductData[0].total_count;
        }
    }
    const { data: getOneProductWeek } = useGetOneProductQuery(idProductWeek);

    //end week

    //month
    let idProductMonth = null;
    let totalMonth = null;
    if (topProductMonth && topProductMonth.data) {
        const topProductData = topProductMonth.data;
        if (topProductData.length > 0) {
            idProductMonth = topProductData[0].product_id;
            totalMonth = topProductData[0].total_count;
        }
    }
    const { data: getOneProductMonth } = useGetOneProductQuery(idProductMonth);
    //end month
    const [selectedOption, setSelectedOption] = useState("Theo Ngày");
    const [productByDay, setProductByDay] = useState("");
    const [productByWeek, setProductByWeek] = useState("");
    const [productByMonth, setProductByMonth] = useState("");



    useEffect(() => {
        if (selectedOption === "Theo Ngày" && getOneProduct) {
            setProductByDay(getOneProduct?.data[0]?.product_name);
        } else if (selectedOption === "Theo Tuần") {
            setProductByWeek(getOneProductWeek?.data[0]?.product_name);
        } else if (selectedOption === "Theo Tháng") {
            setProductByMonth(getOneProductMonth?.data[0]?.product_name);
        }
    }, [selectedOption, getOneProduct, getOneProductWeek, getOneProductMonth]);
    return (
        <div className="col-md-4">
            <div className="card-body">
                <div className="text-center">
                    <div className="dropdown">
                        <button
                            className="btn btn-sm btn-outline-primary dropdown-toggle"
                            type="button"
                            id="growthReportId"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            {selectedOption}
                        </button>
                        <div
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="growthReportId"
                        >
                            <button
                                className="dropdown-item"
                                onClick={() => setSelectedOption("Theo Ngày")}
                            >
                                Theo Ngày
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => setSelectedOption("Theo Tuần")}
                            >
                                Theo Tuần
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => setSelectedOption("Theo Tháng")}
                            >
                                Theo Tháng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="growthChart"></div>
            <div className="text-center fw-semibold pt-3 mb-2">
                {selectedOption === "Theo Ngày" ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                            src={imageArray ? imageArray[0] : ""}
                            alt=""
                            width={"40px"}
                            style={{ marginLeft: "20px", marginRight: "30px" }} // Điều chỉnh khoảng cách giữa ảnh và div
                        />
                        <div style={{ whiteSpace: "nowrap", marginRight: "30px" }}>
                            {productByDay}
                        </div>
                        <div>{total}</div>
                    </div>
                ) : selectedOption === "Theo Tuần" ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                            src={imageArray ? imageArray[0] : ""}
                            alt=""
                            width={"40px"}
                            style={{ marginLeft: "20px", marginRight: "30px" }} // Điều chỉnh khoảng cách giữa ảnh và div
                        />
                        <div style={{ whiteSpace: "nowrap", marginRight: "30px" }}>
                            {productByWeek}
                        </div>
                        <div>{totalWeek}</div>
                    </div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                            src={imageArray ? imageArray[0] : ""}
                            alt=""
                            width={"40px"}
                            style={{ marginLeft: "20px", marginRight: "30px" }} // Điều chỉnh khoảng cách giữa ảnh và div
                        />
                        <div style={{ whiteSpace: "nowrap", marginRight: "30px" }}>
                            {productByMonth}
                        </div>
                        <div>{totalMonth}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopProductRenevue;
