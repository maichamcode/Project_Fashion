import React from "react";
import { useGetOneCatQuery } from "../../../api/category";

const CategoryProduct = ({ data }: any) => {
  const { data: getOneCategory } = useGetOneCatQuery(data?.category_id);
  return (
    <>
      <span className="badge bg-label-primary me-1">
        {getOneCategory?.data[0]?.category_name}
      </span>
    </>
  );
};

export default CategoryProduct;
