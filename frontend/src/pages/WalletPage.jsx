import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const WalletPage = () => {
  const { id } = useParams();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/wallet/${id}`);
        const data = await res.json();
        setWallet(data);
      } catch {
        setWallet(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <section>
      <div className="h-[10vh] w-full"></div>
      <h2 className="text-xl font-bold mb-4">Wallet</h2>
      {wallet ? (
        <div>
          <div className="mb-2">User: {wallet.userName}</div>
          <div className="mb-2">Email: {wallet.email}</div>
          <div className="text-lg font-semibold">Balance: ₹ {wallet.balance}</div>
        </div>
      ) : (
        <div>No wallet data found.</div>
      )}
    </section>
  );
}