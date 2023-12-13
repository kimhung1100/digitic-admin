import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { Link, useParams, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { createProducts, resetState } from "../features/product/productSlice";
let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),

  width: yup.number().required("Width is Required"),
  length: yup.number().required("Length is Required"),
  thickness: yup.number().required("Thickness is Required"),

  // brand: yup.string().required("Brand is Required"),
  // category: yup.string().required("Category is Required"),
  // tags: yup.string().required("Tag is Required"),
  // color: yup
  //   .array()
  //   .min(1, "Pick at least one color")
  //   .required("Color is Required"),
  // quantity: yup.number().required("Quantity is Required"),
});
const DeleteButton = ({ isbn, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:5000/books/${isbn}`
      );
      onDelete(); // Assuming onDelete is a callback to update the UI after deletion

      // Display an alert based on the response
      if (response.data && response.data.message) {
        alert(response.data.message);
      } else {
        alert("Book deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting book:", error);

      // Check if the error has a response and extract the error message
      const errorMessage = error.response?.data?.error || "Error deleting book";

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "8px 16px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
};
const Addproduct = () => {
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const [product, setproduct] = useState({});
  const navigate = useNavigate();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);
  useEffect(() => {
    // Update form values when product data changes
    formik.setValues({
      ISBN: product[0]?.ISBN || "",
      title: product[0]?.title || "",
      description: product[0]?.description || "",
      width: product[0]?.width || "",
      length: product[0]?.length || "",
      thickness: product[0]?.thickness || "",
      price: product[0]?.price || "",
      category1: product[0]?.category1 || "",
      category2: product[0]?.category2 || "",
      images_link1: product[0]?.images_link1 || "",
      images_link2: product[0]?.images_link2 || "",
      images_link3: product[0]?.images_link3 || "",
      book_cover: product[0]?.book_cover || "",
      author_id1: product[0]?.author_id1 || "",
      author_id2: product[0]?.author_id2 || "",
      print_length: product[0]?.print_length || "",
      publication_date: product[0]?.publication_date || "",
      publisher: product[0]?.publisher || "",
    });
  }, [product]);

  useEffect(() => {
    axios.get(`http://localhost:5000/books/${id}`).then((response) => {
      console.log(response.data);
      setproduct(response.data);
    });
  }, [id]);

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state.upload.images);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, createdProduct } = newProduct;
  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfullly!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  const coloropt = [];
  colorState.forEach((i) => {
    coloropt.push({
      label: i.title,
      value: i._id,
    });
  });
  const img = [];
  imgState.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    });
  });
  // # Extracting data for the stored procedure
  // p_ISBN = data.get('ISBN')
  // p_title = data.get('title')
  // p_book_cover = data.get('book_cover')
  // p_description = data.get('description')
  // p_dimensions = data.get('dimensions')
  // p_print_length = data.get('print_length')
  // p_price = data.get('price')
  // p_publication_date = data.get('publication_date')
  // p_publisher = data.get('publisher')
  // p_author_ids = json.dumps(data.get('author_ids'))

  // p_category_ids = json.dumps(data.get('category_ids'))

  // p_image_links = json.dumps(data.get('image_links'))

  useEffect(() => {
    formik.values.color = color ? color : " ";
    formik.values.images = img;
  }, [color, img]);

  const formik = useFormik({
    initialValues: {
      ISBN: "",
      title: "",
      description: "",
      width: "",
      length: "",
      thickness: "",
      price: "",
      category1: "",
      category2: "",
      images_link1: "",
      images_link2: "",
      images_link3: "",
      book_cover: "",
      author_id1: "",
      author_id2: "",

      print_length: "",
      publication_date: "",
      publisher: "",
    },

    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);

      axios
        .post("http://localhost:5000/books/", {
          ISBN: values.ISBN,
          title: values.title,
          description: values.description,
          price: values.price,
          category_ids: [values.category1, values.category2],
          quantity: values.quantity,
          images: [
            values.images_link1,
            values.images_link2,
            values.images_link3,
          ],
          book_cover: values.book_cover,
          width: values.width,
          length: values.length,
          thickness: values.thickness,
          author_ids: [values.author_id1, values.author_id2],
          print_length: values.print_length,
          publication_date: values.publication_date,
          publisher: values.publisher,
        })
        .then((response) => {
          console.log(response);
          alert(response.data.message);
        });

      // formik.resetForm();
      setColor(null);
      // setTimeout(() => {
      //   // dispatch(resetState());
      // }, 3000);
    },
  });
  const handleColors = (e) => {
    setColor(e);
    console.log(color);
  };

  return (
    <div>
      <h3 className="mb-4 title">Update Book</h3>
      <DeleteButton isbn={id} onDelete={() => navigate("/admin/")} />
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product ISBN "
            name="ISBN"
            onChng={formik.handleChange("ISBN")}
            onBlr={formik.handleBlur("ISBN")}
            val={formik.values.ISBN}
          />
          <div className="error">
            {formik.touched.ISBN && formik.errors.ISBN}
          </div>
          {/* end input */}
          {/* begin input */}
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            initialValues=""
            enableReinitialize={true}
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          {/* end input */}
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          {/* end input */}

          {/* begin input */}
          <CustomInput
            type="text"
            label="Enter Product Category 1"
            name="category1"
            onChng={formik.handleChange}
            onBlr={formik.handleBlur}
            val={formik.values.category1}
          />
          <div className="error">
            {formik.touched.category1 && formik.errors.category1}
          </div>

          <CustomInput
            type="text"
            label="Enter Product Category 2"
            name="category2"
            onChng={formik.handleChange}
            onBlr={formik.handleBlur}
            val={formik.values.category2}
          />
          <div className="error">
            {formik.touched.category2 && formik.errors.category2}
          </div>

          <CustomInput
            type="text"
            label="Enter Product Image Link 1"
            name="images_link1"
            onChng={(e) => formik.handleChange(e)}
            onBlr={formik.handleBlur}
            val={formik.values.images_link1}
          />
          <div className="error">
            {formik.touched.images_link1 && formik.errors.images_link1}
          </div>

          <CustomInput
            type="text"
            label="Enter Product Image Link 2"
            name="images_link2"
            onChng={(e) => formik.handleChange(e)}
            onBlr={formik.handleBlur}
            val={formik.values.images_link2}
          />
          <div className="error">
            {formik.touched.images_link2 && formik.errors.images_link2}
          </div>

          <CustomInput
            type="text"
            label="Enter Product Image Link 3"
            name="images_link3"
            onChng={(e) => formik.handleChange(e)}
            onBlr={formik.handleBlur}
            val={formik.values.images_link3}
          />
          <div className="error">
            {formik.touched.images_link3 && formik.errors.images_link3}
          </div>

          <div className="d-flex gap-3">
            {/* begin input for width */}
            <CustomInput
              type="number"
              label="Width (cm)"
              name="width"
              onChng={formik.handleChange("width")}
              onBlr={formik.handleBlur("width")}
              val={formik.values.width}
            />
            {/* end input */}

            {/* begin input for length */}
            <CustomInput
              type="number"
              label="Length (cm)"
              name="length"
              onChng={formik.handleChange("length")}
              onBlr={formik.handleBlur("length")}
              val={formik.values.length}
            />
            {/* end input */}

            {/* begin input for thickness */}
            <CustomInput
              type="number"
              label="Thickness (cm)"
              name="thickness"
              onChng={formik.handleChange("thickness")}
              onBlr={formik.handleBlur("thickness")}
              val={formik.values.thickness}
            />
            {/* end input */}
          </div>
          <div>
            <label>Enter Product Book Cover (hardcover/paperback)</label>
            <select
              name="book_cover"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.book_cover}
            >
              <option value="">Select Book Cover</option>
              <option value="hardcover">Hardcover</option>
              <option value="paperback">Paperback</option>
            </select>
            <div className="error">
              {formik.touched.book_cover && formik.errors.book_cover}
            </div>
          </div>

          <CustomInput
            type="text"
            label="Enter Product Author ID 1"
            name="author_id1"
            onChng={formik.handleChange}
            onBlr={formik.handleBlur}
            val={formik.values.author_id1}
          />
          <div className="error">
            {formik.touched.author_id1 && formik.errors.author_id1}
          </div>

          <CustomInput
            type="text"
            label="Enter Product Author ID 2"
            name="author_id2"
            onChng={formik.handleChange}
            onBlr={formik.handleBlur}
            val={formik.values.author_id2}
          />
          <div className="error">
            {formik.touched.author_id2 && formik.errors.author_id2}
          </div>

          <CustomInput
            type="number"
            label="Enter Product Print Length "
            name="print_length"
            onChng={formik.handleChange("print_length")}
            onBlr={formik.handleBlur("print_length")}
            val={formik.values.print_length}
          />
          <div className="error">
            {formik.touched.print_length && formik.errors.print_length}
          </div>

          <CustomInput
            type="date"
            label="Enter Product Publication Date "
            name="publication_date"
            onChng={formik.handleChange("publication_date")}
            onBlr={formik.handleBlur("publication_date")}
            val={formik.values.publication_date}
          />
          <div className="error">
            {formik.touched.publication_date && formik.errors.publication_date}
          </div>
          {/* end input */}
          <CustomInput
            type="text"
            label="Enter Product Publisher "
            name="publisher"
            onChng={formik.handleChange("publisher")}
            onBlr={formik.handleBlur("publisher")}
            val={formik.values.publisher}
          />
          <div className="error">
            {formik.touched.publisher && formik.errors.publisher}
          </div>
          {/* end input */}
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
