import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { shopCategories, shopStates } from "../constants/constants";

export const SellForm = () => {
  const { user } = useUser();
  const [form, setForm] = useState({
    productName: "",
    productPrice: "",
    productState: "",
    productCategory: "",
    productSellerName: user?.fullName || "",
    productImage: null,
    productDescription: "",
    productMaterial: "",
    productWeight: "",
    productColor: "",
    isCodAvailable: false,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, productImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMsg("");
  try {
    // 1. Get signature from backend
    const sigRes = await axios.get("http://localhost:5000/api/cloudinary-signature");
    const { signature, timestamp, apiKey, cloudName } = sigRes.data;

    // 2. Upload image to Cloudinary with signature
    let imageUrl = "";
    if (form.productImage) {
      const data = new FormData();
      data.append("file", form.productImage);
      data.append("api_key", apiKey);
      data.append("timestamp", timestamp);
      data.append("signature", signature);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data
      );
      imageUrl = res.data.secure_url;
    }

    // 3. Send product data to backend
    const payload = {
      ...form,
      productImageUrl: imageUrl,
      productSellerName: user?.fullName || "",
    };
    delete payload.productImage;
    await axios.post("http://localhost:5000/api/shopcards", payload);
    setMsg("Product listed successfully!");
    setForm({
      productName: "",
      productPrice: "",
      productState: "",
      productCategory: "",
      productSellerName: user?.fullName || "",
      productImage: null,
      productDescription: "",
      productMaterial: "",
      productWeight: "",
      productColor: "",
      isCodAvailable: false,
    });
  } catch (err) {
    setMsg("Failed to list product.");
  }
  setLoading(false);
};

  return (
    <>
      <section>
        <div>
          <div className="w-full h-[10vh]"></div>
          <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Sell on Heartisans</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                value={form.productName}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
              <input
                type="text"
                name="productPrice"
                placeholder="Product Price"
                value={form.productPrice}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
              <select
                name="productState"
                value={form.productState}
                onChange={handleChange}
                required
                className="select select-bordered"
              >
                <option value="">Select State</option>
                {shopStates.map((state) => (
                  <option key={state.name} value={state.name}>{state.name}</option>
                ))}
              </select>
              <select
                name="productCategory"
                value={form.productCategory}
                onChange={handleChange}
                required
                className="select select-bordered"
              >
                <option value="">Select Category</option>
                {shopCategories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                name="productSellerName"
                value={form.productSellerName}
                disabled
                className="input input-bordered bg-gray-100"
              />
              <input
                type="file"
                name="productImage"
                accept=".jpg,.jpeg,.png"
                onChange={handleChange}
                required
                className="file-input file-input-bordered"
              />
              <textarea
                name="productDescription"
                placeholder="Product Description"
                value={form.productDescription}
                onChange={handleChange}
                required
                className="textarea textarea-bordered"
              />
              <input
                type="text"
                name="productMaterial"
                placeholder="Product Material"
                value={form.productMaterial}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
              <input
                type="text"
                name="productWeight"
                placeholder="Product Weight"
                value={form.productWeight}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
              <input
                type="text"
                name="productColor"
                placeholder="Product Color"
                value={form.productColor}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isCodAvailable"
                  checked={form.isCodAvailable}
                  onChange={handleChange}
                  className="checkbox"
                />
                Cash on Delivery Available
              </label>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              {msg && <div className="text-center mt-2">{msg}</div>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};