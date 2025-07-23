import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export const AuctionForm = () => {
  const { user } = useUser();
  const [mongoUserId, setMongoUserId] = useState("");
  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    productImage: null,
    productMaterial: "",
    productWeight: "",
    productColor: "",
    basePrice: "",
    startTime: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      axios.get(`http://localhost:5000/api/user/email/${user.emailAddresses[0].emailAddress}`)
        .then(res => setMongoUserId(res.data._id))
        .catch(() => setMongoUserId(""));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
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
      // 1. Get Cloudinary signature from backend
      const sigRes = await axios.get("http://localhost:5000/api/cloudinary-signature");
      const { signature, timestamp, apiKey, cloudName } = sigRes.data;

      // 2. Upload image to Cloudinary
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

      // 3. Send auction data to backend
      const payload = {
        productName: form.productName,
        productDescription: form.productDescription,
        productImageUrl: imageUrl,
        productMaterial: form.productMaterial,
        productWeight: form.productWeight,
        productColor: form.productColor,
        sellerId: mongoUserId,
        sellerName: user?.fullName,
        basePrice: Number(form.basePrice),
        startTime: new Date(form.startTime),
        duration: Number(form.duration), // in seconds or minutes
      };
      await axios.post("http://localhost:5000/api/auctions", payload);
      setMsg("Auction created successfully!");
      setForm({
        productName: "",
        productDescription: "",
        productImage: null,
        productMaterial: "",
        productWeight: "",
        productColor: "",
        basePrice: "",
        startTime: "",
        duration: "",
      });
    } catch (err) {
      setMsg("Failed to create auction.");
    }
    setLoading(false);
  };

  return (
    <>
      <section>
        <div>
          <div className="w-full h-[10vh]"></div>
          <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Start an Auction</h2>
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
              <textarea
                name="productDescription"
                placeholder="Product Description"
                value={form.productDescription}
                onChange={handleChange}
                required
                className="textarea textarea-bordered"
              />
              <input
                type="file"
                name="productImage"
                accept=".jpg,.jpeg,.png"
                onChange={handleChange}
                required
                className="file-input file-input-bordered"
              />
              <input
                type="text"
                name="productMaterial"
                placeholder="Product Material"
                value={form.productMaterial}
                onChange={handleChange}
                className="input input-bordered"
              />
              <input
                type="text"
                name="productWeight"
                placeholder="Product Weight"
                value={form.productWeight}
                onChange={handleChange}
                className="input input-bordered"
              />
              <input
                type="text"
                name="productColor"
                placeholder="Product Color"
                value={form.productColor}
                onChange={handleChange}
                className="input input-bordered"
              />
              <input
                type="number"
                name="basePrice"
                placeholder="Base Price"
                value={form.basePrice}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
              <label>
                Auction Start Time:
                <input
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                  className="input input-bordered"
                />
              </label>
              <input
                type="number"
                name="duration"
                placeholder="Duration (seconds)"
                value={form.duration}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
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