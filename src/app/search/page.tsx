import ClientOnly from "src/components/utils/ClientOnly";
import SearchPage from "./SearchPage";

export default function Page() {
  return (
    <ClientOnly>
      <SearchPage />
    </ClientOnly>
  );
}