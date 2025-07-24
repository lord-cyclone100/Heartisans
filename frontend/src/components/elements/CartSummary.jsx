export const CartSummary = ({ cart, onCheckout }) => {
  const total = cart?.items?.reduce(
    (sum, item) => sum + (item.productPrice * (item.quantity || 1)),
    0
  );

  return (
    <div className="bg-white rounded shadow p-6 mb-8 flex flex-col items-end">
      <div className="text-xl font-bold mb-2">Total: Rs {total || 0}</div>
      <button
        className="btn btn-success"
        disabled={!cart || !cart.items || cart.items.length === 0}
        onClick={() => onCheckout(total)}
      >
        Checkout
      </button>
    </div>
  );
};