import React, { SetStateAction, useState } from "react";
import {
  useGetAllFavoriteProductsQuery,
  useGetFavoriteWithUserQuery,
} from "../../../api/favorite_product";
import { Pagination } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import FavoriteProductDetail from "./FavoriteProductDetail";
import {
  useGetOneProductQuery,
  useGetProductsQuery,
} from "../../../api/product";
// import '@fortawesome/fontawesome-free/css/all.min.css';

const FavoriteProduct = () => {
  const user = JSON.parse(localStorage.getItem("user")!);
  // console.log(user?.user?.id);
  const { data: getFavoriteWithUser } = useGetFavoriteWithUserQuery(
    user?.user?.id
  );
  // console.log(getFavoriteWithUser);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handlePageChange = (page: SetStateAction<number>, pageSize: any) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = getFavoriteWithUser?.data?.slice(startIndex, endIndex);
  // console.log(paginatedData);

  return (
    <>
      <section
        className="breadcrumb breadcrumb_bg"
        style={{ marginTop: "70px", backgroundColor: "#eeee" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="breadcrumb_iner">
                <div className="breadcrumb_iner_item">
                  <h2>Sản phẩm yêu thích</h2>
                  <p>
                    Trang chủ <span>-</span> Sản phẩm yêu thích
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="favorite_area "
        style={{ padding: "60px", backgroundColor: "#f5f5f5" }}
      >
         {/* Các phần code khác */}
    {getFavoriteWithUser?.data && getFavoriteWithUser.data.length > 0 ? (
      <div className="container">
        <div className="row justify-content-center mb-3">
          {/* Hiển thị sản phẩm yêu thích nếu có */}
          {paginatedData?.map((item: any) => (
            <FavoriteProductDetail data={item} key={item.id} />
          ))}
        </div>

        {/* Pagination */}
        <hr />
        <Pagination
          current={currentPage}
          total={getFavoriteWithUser?.data?.length || 0}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
        />
      </div>
    ) : (
      // Hiển thị thông báo khi không có sản phẩm yêu thích
      <div className="col-lg-12">
      <p style={{ textAlign: "center", fontSize: "28px", fontFamily:"Tahoma" }}>
        Không có sản phẩm yêu thích
      </p>
    </div>
    )}
      </section>
    </>
  );
};

export default FavoriteProduct;
