import React from "react";
import "./styleTopProductSelect.css";
const Top1ProductSelect = ({ selectedOption, setSelectedOption }: any) => {
  console.log(selectedOption);
  
  return (
    <div>
      <button
        className="btn btn-sm  dropdown-toggle "
        type="button"
        id="growthReportId"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        style={{ marginBottom: "5px", borderColor: "#cccc",padding:'5px 20px',color:'black' }}
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
          Ngày
        </button>
        <button
          className="dropdown-item"
          onClick={() => setSelectedOption("Theo Tuần")}
        >
          Tuần
        </button>
        <button
          className="dropdown-item"
          onClick={() => setSelectedOption("Theo Tháng")}
        >
          Tháng
        </button>
      </div>
    </div>
  );
};

export default Top1ProductSelect;
