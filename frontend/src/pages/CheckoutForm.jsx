import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export const CheckoutForm = () => {
  const { user } = useUser();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const location = useLocation();
  const total = location.state?.total || 0;

  return (
    <>
      <section>
        <div>
          <div className="h-[10vh] w-full"></div>
          <div className="max-w-lg mx-auto bg-white rounded shadow p-8 mt-10">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            
            <form>
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
                <button type="submit" className="btn btn-success w-full text-lg">
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