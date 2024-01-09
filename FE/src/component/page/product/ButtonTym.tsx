import { AiOutlineHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useAddFavoriteProductMutation,
  useDeleteFavoriteProductMutation,
  useGetFavoriteWithUserQuery,
} from "../../../api/favorite_product";
import { useGetOneProductQuery } from "../../../api/product";
import { message } from "antd";
import { AiFillHeart } from "react-icons/ai";
import "../../page/product/styleButton.css";
const ButtonTym = ({ data }: any) => {
  const [deleteProduct] = useDeleteFavoriteProductMutation();
  const [addFavoriteProduct] = useAddFavoriteProductMutation();
  const { data: getOneProduct } = useGetOneProductQuery(data?.product_id);
  const user = JSON.parse(localStorage.getItem("user")!);
  // console.log(user);

  //
  //  const user = JSON.parse(localStorage.getItem("user")!);
  const { data: getFavoriteWithUser, refetch } = useGetFavoriteWithUserQuery(
    user?.user?.id
  );
  // console.log(getFavoriteWithUser?.data);

  // Kiểm tra xem sản phẩm đã được thêm vào danh sách yêu thích trong localStorage
  const initialIsAddedToFavorite =
    localStorage.getItem(`favorite_${data.product_id}`) === "true";
  const [isAddedToFavorite, setIsAddedToFavorite] = useState(
    initialIsAddedToFavorite
  );

  const onHandleAddFavoriteProduct = () => {
    const productID = getOneProduct?.data[0]?.product_id;
    const data = {
      user_id: user?.user?.id,
      product_id: getOneProduct?.data[0]?.product_id,
    };

    if (isAddedToFavorite) {
      // Nếu sản phẩm đã được yêu thích, hãy xóa nó khỏi danh sách yêu thích
      if (getFavoriteWithUser?.data) {
        deleteProduct(productID)
          .unwrap()
          .then(() => {
            // Cập nhật trạng thái thành công
            setIsAddedToFavorite(false);
            // Xóa trạng thái khỏi localStorage
            localStorage.removeItem(`favorite_${productID}`);
          });
      }
    } else {
      // Nếu sản phẩm chưa được yêu thích, hãy thêm nó vào danh sách yêu thích

      // Gọi mutation để thêm sản phẩm vào danh sách yêu thích
      addFavoriteProduct(data)
        .unwrap()
        .then(() => {
          // Cập nhật trạng thái thành công
          setIsAddedToFavorite(true);

          // Lưu trạng thái vào localStorage
          localStorage.setItem(`favorite_${productID}`, "true");
        });
    }
  };
  return (
    <Link to="#" className={`like_us ${!user ? "disabled-button" : ""}`}>
      <button
        style={{ border: "none", background: "white", width: "100%" }}
        onClick={onHandleAddFavoriteProduct}
        disabled={!user}
      >
        {isAddedToFavorite ? (
          <AiFillHeart
            style={{
              fontSize: "24px",
              color: "red",
              opacity: !user ? 0.2 : 1, // Áp dụng opacity khi bị vô hiệu hóa
            }}
          />
        ) : (
          <AiOutlineHeart
            style={{
              fontSize: "24px",
              color: "black",
              opacity: !user ? 0.2 : 1, // Áp dụng opacity khi bị vô hiệu hóa
            }}
          />
        )}
      </button>
    </Link>
  );
};

export default ButtonTym;
