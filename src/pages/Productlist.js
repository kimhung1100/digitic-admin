import React, { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/product/productSlice";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const columns = [
  {
    title: "ISBN",
    dataIndex: "ISBN",
    sorter: (a, b) => a.ISBN - b.ISBN,
    render: (text, record) => (
      <Link
        to={`/admin/product/${record.ISBN}`}
        // onClick={() => handleBookClick(record.ISBN)}
      >
        {text}
      </Link>
    ),
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title - b.title,
  },

  {
    title: "Book cover",
    dataIndex: "book_cover",
    sorter: (a, b) => a.book_cover - b.book_cover,
  },
  {
    title: "Print length",
    dataIndex: "print_length",
    sorter: (a, b) => a.print_length - b.print_lengthe,
  },
  {
    title: "Length",
    dataIndex: "length",
    sorter: (a, b) => a.length - b.length,
  },
  {
    title: "Thick",
    dataIndex: "thick",
    sorter: (a, b) => a.thick - b.thick,
  },
  {
    title: "Width",
    dataIndex: "width",
    sorter: (a, b) => a.width - b.width,
  },
  {
    title: "Date",
    dataIndex: "publication_date",
    sorter: (a, b) => a.publication_date - b.publication_date,
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
];

const Productlist = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product.products);
  const handleBookClick = (ISBN) => {
    navigate(`/product/${ISBN}`);
  };
  const [filteredData, setFilteredData] = useState([]);
  const [category_id, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // useEffect(() => {
  //   // Filter books based on category and price range

  //   // Prepare data for the table
  //   const dataForTable = filteredBooks.map((book, index) => ({
  //     key: index + 1,
  //     category_id: book.category_id,
  //     price: `${book.price}`,
  //     action: (
  //       <>
  //         <Link to="/" className="fs-3 text-danger">
  //           <BiEdit />
  //         </Link>
  //         <Link className="ms-3 fs-3 text-danger" to="/">
  //           <AiFillDelete />
  //         </Link>
  //       </>
  //     ),
  //   }));

  //   setFilteredData(dataForTable);
  // }, [productState, category_id, minPrice, maxPrice]);

  const handleSearch = async () => {
    // Trigger filtering when the user clicks the "Search" button
    try {
      // const response = await axios.get(
      //   `http://localhost:${BackendPORT}/ourProduct?search=${searchQuery}`
      // );
      const response = await axios.get(
        `http://localhost:5000/books/?category_id=${category_id}&min_price=${minPrice}&max_price=${maxPrice}`
      );
      console.log("--------> response.data");
      console.log(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div>
      <h3 className="mb-4 title">Products</h3>
      <div>
        <Input
          placeholder="Category_id"
          value={category_id}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Input
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <div>
        <Table columns={columns} dataSource={filteredData} />
      </div>
    </div>
  );
};

export default Productlist;
