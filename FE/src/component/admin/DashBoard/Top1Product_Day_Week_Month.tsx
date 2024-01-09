import Top1ProductName from "./Top1ProductName";

const Top1Product_Day_Week_Month = ({
  selectedOption,
  setSelectedOption,
  topProducts,
}: any) => {
  return (
    <div className="col-md-4" style={{padding:10}}>
      <div className="card-body">
        <div className="text-center"></div>
      </div>
      <div
        id="growthChart"
        style={{ marginTop: "-30px", marginBottom: "-50px" }}
      >
        <div className="dropdown"></div>
      </div>

      <div
        className="text-center fw-semibold pt-3 mb-2"
        style={{ marginTop: "0px" }}
      >
        {selectedOption === "Theo Ngày" ||
        selectedOption === "Theo Tuần" ||
        selectedOption === "Theo Tháng"
          ? topProducts?.data?.map((product: any, index: any) => (
              <Top1ProductName key={index} product_id={product.product_id} />
            ))
          : null}
      </div>
    </div>
  );
};

export default Top1Product_Day_Week_Month;
