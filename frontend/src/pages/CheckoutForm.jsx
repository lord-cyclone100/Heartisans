import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'

export const CheckoutForm = () => {
  const { user } = useUser();
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [message, setMessage] = useState('')
  const [address, setAddress] = useState("");
  const navigate = useNavigate()
  const location = useLocation();
  const total = location.state?.total || 0;

  const handlePayment = async(e) => {
    e.preventDefault();
    const data = {
      name:user.fullName,
      mobile:phoneNumber,
      amount:total
    }
    // console.log(data);
    try {
      console.log("Hello");
      const response = await axios.post("http://localhost:5000/create-order",data)
      console.log("Payment API response:", response.data);
      const responseData = response.data;
      // window.location.href = response.data.url
      if (responseData.paymentSessionId && responseData.orderId) {
        // Navigate to payment page with order details
        navigate('/payment', { 
          state: { 
            orderId: responseData.orderId,
            paymentSessionId: responseData.paymentSessionId,
            bookingData: data
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <section>
        <div>
          <div className="h-[10vh] w-full"></div>
          <div className="max-w-lg mx-auto bg-white rounded shadow p-8 mt-10">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            
            <form onSubmit={handlePayment}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Username</label>
                <input
                  type="text"
                  value={user?.fullName || ""}
                  disabled
                  className="input input-bordered w-full bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  value={user?.emailAddresses?.[0]?.emailAddress || ""}
                  disabled
                  className="input input-bordered w-full bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-1 font-semibold">Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter your address"
                  required
                />
              </div>
              <div className="">
                <div className="text-xl font-bold mb-6">Total Amount: Rs {total}</div>
                <button type="submit" className="btn btn-success w-full text-lg" >
                  Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}