import { useEffect, useState } from "react";
import { useGetAllCatNoPaginationQuery } from "../../api/category";
import "../../layout/ClientLayOut/css/all.css";
import Product from "./product/product";
import SaleInShop from "./product/saleInShop";
import { Link } from "react-router-dom";
import { useGetColorQuery } from "../../api/color";
import { useGetSizeQuery } from "../../api/size";
import useScrollToTopOnMount from "../../utils/useScrollToTopOnMount";

import SearchProduct from "./SearchProduct/SearchProduct";
import { useFillterProductMaxQuery, useFillterProductMinQuery, useGetSearchProductMutation, useSortProductAtoZQuery, useSortProductZtoAQuery } from "../../api/product";
import { Form } from "antd";

const ShopProduct = () => {
  const {
    data: category,
    isError,
    isLoading,
  } = useGetAllCatNoPaginationQuery("");
  const { data: color } = useGetColorQuery("");
  const { data: size } = useGetSizeQuery("");
  useEffect(() => {
    if (isError) {
      console.error("error");
    }
    if (isLoading) {
      console.error("Error loading");
    }
  }, [isError, isLoading]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceFilterApplied, setPriceFilterApplied] = useState(false);
  const [search, setSearch] = useState(null);
  const [name, setName] = useState();
  const [getSearch, { isLoading: searchLoading }] =
    useGetSearchProductMutation();
  const [form] = Form.useForm();
  useScrollToTopOnMount(category?.data);
  // console.log(search);

  const [sortedProducts, setSortedProducts] = useState([]); // Khai báo sortedProducts ở đây
  // console.log("sortedProducts: ", sortedProducts);

  const [sortOption, setSortOption] = useState("atoz");
  const { data: sortAtoZData } = useSortProductAtoZQuery('');
  const { data: sortZtoAData } = useSortProductZtoAQuery('');
  const { data: filtermax } = useFillterProductMaxQuery('')
  const { data: filtermin } = useFillterProductMinQuery('')
  const handleSortChange = (event: any) => {
    const value = event.target.value;
    setSortOption(value);
  };
  useEffect(() => {
    if (sortOption === "filtermax") {
      if (filtermax) {
        setSortedProducts(filtermax);
        // console.log("a to z: ", sortAtoZData);
      }
    } else if (sortOption === "filtermin") {
      if (filtermin) {
        setSortedProducts(filtermin);
        // console.log("Z to A: ", sortZtoAData);
      }
    }
  }, [sortOption, filtermax, filtermin]);
  useEffect(() => {
    if (sortOption === "atoz") {
      if (sortAtoZData) {
        setSortedProducts(sortAtoZData);
        // console.log("a to z: ", sortAtoZData);
      }
    } else if (sortOption === "ztoa") {
      if (sortZtoAData) {
        setSortedProducts(sortZtoAData);
        // console.log("Z to A: ", sortZtoAData);
      }
    }
  }, [sortOption, sortAtoZData, sortZtoAData]);

  const HandleSearch = () => {
    if (name == "") {
      setSearch(null);
    } else if (name) {
      const nameData = {
        product_name: name,
      };
      getSearch(nameData)
        .unwrap()
        .then((data: any) => {
          setSearch(data);
        });
    }
  };

  const handleMinPriceChange = (e: any) => {
    const value = e.target.value;

    // Validate input to allow only numeric and non-negative values
    if (/^\d*\.?\d*$/.test(value)) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e: any) => {
    const value = e.target.value;

    // Validate input to allow only numeric and non-negative values
    if (/^\d*\.?\d*$/.test(value)) {
      setMaxPrice(value);
    }
  };

  const handleCategoryClick = (categoryId: any) => {
    if (categoryId === selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(categoryId);
    }
  };
  const handleColorClick = (colorId: any) => {
    if (colorId === selectedColor) {
      setSelectedColor("");
    } else {
      setSelectedColor(colorId);
    }
  };
  const handleSizeClick = (sizeId: any) => {
    if (sizeId === selectedSize) {
      setSelectedSize("");
    } else {
      setSelectedSize(sizeId);
    }
  };

  return (
    <>
      <div id="top"></div>
      <div className="shopProductContainer">
        <section
          className="breadcrumb breadcrumb_bg"
          style={{ marginTop: "70px", backgroundColor: "#eeee" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="breadcrumb_iner">
                  <div className="breadcrumb_iner_item">
                    <h2>Sản phẩm</h2>
                    <p>
                      Trang chủ <span>-</span> Sản phẩm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="cat_product_area section_padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <div className="left_sidebar_area">
                  <aside className="left_widgets p_filter_widgets">
                    <div className="l_w_title">
                      <h3>Danh Mục</h3>
                    </div>
                    <div className="widgets_inner">
                      <ul className="list">
                        {category?.data?.map((category: any) => (
                          <li
                            key={category.category_id}
                            className={`dropdown-item ${selectedCategory === category.category_id
                              ? "active"
                              : ""
                              }`}
                            onClick={() =>
                              handleCategoryClick(category.category_id)
                            }
                          >
                            {category.category_name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>

                  <aside className="left_widgets p_filter_widgets">
                    <div className="l_w_title">
                      <h3>Màu</h3>
                    </div>
                    <div className="widgets_inner">
                      <ul className="list">
                        {color?.data?.map((color: any) => (
                          <li
                            key={color.color_id}
                            className={`dropdown-item ${selectedColor === color.color_id ? "active" : ""
                              }`}
                            onClick={() => handleColorClick(color.color_id)}
                          >
                            {color.color_name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>

                  <aside className="left_widgets p_filter_widgets">
                    <div className="l_w_title">
                      <h3>Size</h3>
                    </div>
                    <div className="widgets_inner">
                      <ul className="list">
                        {size?.data?.map((size: any) => (
                          <li
                            key={size.size_id}
                            className={`dropdown-item ${selectedSize === size.size_id ? "active" : ""
                              }`}
                            onClick={() => handleSizeClick(size.size_id)}
                          >
                            {size.size_name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>

                 
                </div>
              </div>
              <div className="col-lg-9">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="product_top_bar d-flex justify-content-between align-items-center">
                      {/* <div className="single_product_menu">
                        <p>
                          <span>10000 </span> Prodict Found
                        </p>
                      </div> */}

                      <div className="single_product_menu d-flex">
                        <select
                          className="sort-select" // Add a CSS class here
                          onChange={handleSortChange}
                          value={sortOption}
                          style={{ marginLeft: "20px" }}
                        >
                          <option value="atoz">Sản phẩm A - Z</option>
                          <option value="ztoa">Sản phẩm Z - A</option>
                          <option value="filtermax">Sản phẩm giá cao - thấp</option>
                          <option value="filtermin">Sản phẩm giá thấp - cao</option>
                        </select>
                      </div>
                      <aside className=" price_rangs_aside" style={{marginTop:12}}>
                        <div className="widgets_inner">
                          <div className="range_item">
                            <input
                              type="text"
                              placeholder="Min Price"
                              value={minPrice}
                              onChange={handleMinPriceChange}
                              style={{height:32}}
                            />
                            <div className="separator-icon">→</div>

                            <input
                              type="text"
                              placeholder="Max Price"
                              value={maxPrice}
                              onChange={handleMaxPriceChange}
                              style={{ height: 32 }}
                            />
                          </div>
                        </div>
                      </aside>
                      {/* <div className="single_product_menu d-flex">
                        <h5>show :</h5>
                        <div className="top_pageniation">
                          <ul>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                          </ul>
                        </div>
                      </div> */}
                      <div className="single_product_menu d-flex">
                        <div className="input-group">
                          <Form form={form} onFinish={HandleSearch}>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="search"
                              aria-describedby="inputGroupPrepend"
                              onChange={(e: any) => setName(e.target.value)}
                            // onClick={HandleSearch}
                            />
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* product */}
                {search == null ? (
                  <Product
                    selectedCategory={selectedCategory}
                    selectedColor={selectedColor}
                    selectedSize={selectedSize}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    productsort={sortedProducts} // Pass the sorted products here
                  />
                ) : (
                  <SearchProduct
                    dataSearch={search}
                    searchLoading={searchLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="product_list best_seller section_padding">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="section_tittle text-center">
                  <h2 style={{ marginLeft: "25px", marginTop:-150}}>
                    Sản phẩm Sale
                  </h2>
                </div>
              </div>
            </div>
            <div className="row align-items-center latest_product_inner">
              <SaleInShop />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopProduct;