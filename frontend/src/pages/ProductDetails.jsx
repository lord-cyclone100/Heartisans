import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

export const ProductDetails = () => {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const { user } = useUser();
  const [mongoUserId, setMongoUserId] = useState("");
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/shopcards/${id}`)
      .then(res => setCard(res.data))
      .catch(() => setCard(null));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    axios.get(`http://localhost:5000/api/user/email/${user.emailAddresses[0].emailAddress}`)
      .then(res => setMongoUserId(res.data._id))
      .catch(() => setMongoUserId(""));
  }, [user]);

  useEffect(() => {
    if (!mongoUserId || !card) return;
    axios.get(`http://localhost:5000/api/cart/${mongoUserId}`)
      .then(res => {
        const found = res.data?.items?.some(item => item.productId === card._id);
        setInCart(found);
      })
      .catch(() => setInCart(false));
  }, [mongoUserId, card]);

  const handleAddToCart = async () => {
    if (!mongoUserId || !card) return;
    await axios.post("http://localhost:5000/api/cart/add", {
      userId: mongoUserId,
      productId: card._id,
      productName: card.productName,
      productImageUrl: card.productImageUrl,
      productPrice: card.productPrice,
      productCategory: card.productCategory
    });
    setInCart(true);
  };

  const handleRemoveFromCart = async () => {
    if (!mongoUserId || !card) return;
    await axios.post("http://localhost:5000/api/cart/remove", {
      userId: mongoUserId,
      productId: card._id,
    });
    setInCart(false);
  };

  if (!card) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
      <section>
        <div className="bg-[#eee] font-mhlk py-10 px-20">
          <div className="w-full h-[10vh]"></div>
          <div className="flex flex-col items-center mt-10 gap-20 lg:flex-row">
            <div className="size-[80vw] bg-amber-200 lg:size-[40vw]">
              <img src={card.productImageUrl} alt={card.productName} className="size-[100%] object-cover rounded-lg" />
            </div>
            <div className="flex flex-col items-start gap-10">
              <div>
                <h1 className="text-[3rem] font-bold mt-4 lg:text-[5rem]">{card.productName}</h1>
                <p className="text-xl mt-2 lg:text-[3rem] text-wrap">{card.productDescription}</p>
              </div>
              <div>
                <p className="mt-2">Seller: {card.productSellerName}</p>
                <p className="mt-2">Category: {card.productCategory}</p>
                <p className="mt-2">State: {card.productState}</p>
                <p className="mt-2">Material: {card.productMaterial}</p>
                <p className="mt-2">Weight: {card.productWeight}</p>
                <p className="mt-2">Color: {card.productColor}</p>
              </div>
              <h3 className="mt-2 font-bold text-[2rem]">Rs {card.productPrice}</h3>
              <p className="mt-2">{card.isCodAvailable ? "COD Available" : "COD Not Available"}</p>
              <div className="flex gap-8">
                {inCart ? (
                  <button className="btn btn-error text-2xl p-6" onClick={handleRemoveFromCart}>Remove from Cart</button>
                ) : (
                  <button className="btn btn-success text-2xl p-6" onClick={handleAddToCart}>Add to Cart</button>
                )}
                <button className="btn btn-success text-2xl p-6">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}