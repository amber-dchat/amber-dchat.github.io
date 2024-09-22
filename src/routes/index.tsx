import { UserProvider } from "@/lib/hooks/user/useMainUser";
import { usePage } from "./hooks";

import "./index.css"

export default function App() {
  return <UserProvider>{usePage()}</UserProvider>;
}