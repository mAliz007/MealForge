
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useCartView } from "../../hooks/useCartView";

export default function CartView() {
  const {
    t,
    cartItems,
    cartCount,
    cartTotal,
    deliveryFee,
    finalTotal,
    cleanRestaurantId,
    isPending,
    updateQuantity,
    removeFromCart,
    clearCart,
    handleCheckout,
  } = useCartView();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-main">{t("cart.title")}</h1>
        <p className="text-sm text-muted">{t("cart.description")}</p>
      </div>

      {isPending ? (
        <div className="flex justify-center items-center h-64 text-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mr-2"></div>
          {t("cart.transmitting")}
        </div>
      ) : cartItems.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-lg font-medium text-main">{t("cart.empty.title")}</p>
          <p className="text-sm text-muted mt-1">{t("cart.empty.subtitle")}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Items Listing Bucket */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                {t("cart.actions.reviewItems", { count: cartCount, hub: cleanRestaurantId || "Pending" })}
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:underline font-medium"
              >
                {t("cart.actions.clearTray")}
              </button>
            </div>

            {cartItems.map(({ menuItem, quantity }) => {
              const parsedPrice = Number(menuItem.price || 0);
              const rowValuation = parsedPrice * quantity;

              return (
                <Card key={menuItem.id} className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-main">{menuItem.name}</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-accent">
                        {t("cart.actions.each", { price: parsedPrice.toFixed(2) })}
                      </p>
                      <span className="text-xs text-structure">|</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                          className="w-6 h-6 rounded bg-canvas border border-structure hover:bg-structure text-main text-xs font-bold flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-semibold w-6 text-center text-main">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                          className="w-6 h-6 rounded bg-canvas border border-structure hover:bg-structure text-main text-xs font-bold flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className="font-bold text-main">${rowValuation.toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(menuItem.id)}
                      className="inline-flex items-center gap-1 text-xs text-muted hover:text-red-500 transition-colors group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5 text-muted group-hover:text-red-500 transition-colors"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      <span>{t("cart.actions.remove")}</span>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Checkout Accounting Sidebar */}
          <div>
            <Card className="space-y-4 bg-canvas/40 border border-structure p-5">
              <h2 className="text-lg font-bold text-main">{t("cart.sidebar.title")}</h2>

              <div className="space-y-2 text-sm text-muted border-b border-structure pb-4">
                <div className="flex justify-between">
                  <span>{t("cart.sidebar.subtotal")}</span>
                  <span className="font-medium text-main">${Number(cartTotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.sidebar.deliveryFee")}</span>
                  <span className="font-medium text-main">${deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-bold text-main pt-1">
                <span>{t("cart.sidebar.totalDue")}</span>
                <span className="text-lg text-emerald-500">${finalTotal.toFixed(2)}</span>
              </div>

              <Button
                variant="primary"
                className="w-full mt-2 py-2.5 text-sm font-semibold tracking-wide"
                onClick={handleCheckout}
                disabled={isPending}
              >
                {t("cart.actions.checkout")}
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}