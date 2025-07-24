import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { CartSummary } from "../components/elements/CartSummary";

export const CartPage = () => {
  const { user } = useUser();
  const [cart, setCart] = useState(null);
  const [mongoUserId, setMongoUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    axios.get(`http://localhost:5000/api/user/email/${user.emailAddresses[0].emailAddress}`)
      .then(res => {
        setMongoUserId(res.data._id);
        return axios.get(`http://localhost:5000/api/cart/${res.data._id}`);
      })
      .then(res => setCart(res.data))
      .catch(() => setCart({ items: [] }));
  }, [user]);

  const handleRemove = async (productId) => {
    if (!mongoUserId || !productId) return;
    await axios.post("http://localhost:5000/api/cart/remove", {
      userId: mongoUserId,
      productId,
    });
    // Refresh cart after removal
    const res = await axios.get(`http://localhost:5000/api/cart/${mongoUserId}`);
    setCart(res.data);
  };

  const handleVisit = (productCategory,productId) => {
    navigate(`/shop/${productCategory}/${productId}`);
  };

  return (
    <>
      <section>
        <div>
          <div className="h-[10vh] w-full"></div>
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          
          {cart && cart.items.length > 0 ? (
            <ul>
              {cart.items.map(item => (
                <li key={item.productId} className="mb-4 flex gap-4 items-center">
                  <img src={item.productImageUrl} alt={item.productName} className="w-20 h-20 object-cover rounded" />
                  <div>
                    <div className="font-bold">{item.productName}</div>
                    <div>Rs {item.productPrice}</div>
                    <div>Quantity: {item.quantity}</div>
                  </div>
                  <button
                    className="btn btn-primary ml-4"
                    onClick={() => handleVisit(item.productCategory,item.productId)}
                  >
                    Visit
                  </button>
                  <button
                    className="btn btn-error ml-2"
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">Your cart is empty.</div>
          )}
          <CartSummary
            cart={cart}
            onCheckout={total => navigate("/checkout", { state: { total } })}
          />
        </div>
      </section>
    </>
  );
}