import ClientOnly from "src/components/utils/ClientOnly";
import CheckoutPage from "./CheckoutPage";

export default function Page() {
  return (
    <ClientOnly>
      <CheckoutPage />
    </ClientOnly>
  );
}