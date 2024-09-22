import { navigate } from "../hooks";

export default function App() {
  return <div onClick={() => navigate("/this?a=hi")}>
    Home
  </div>;
}