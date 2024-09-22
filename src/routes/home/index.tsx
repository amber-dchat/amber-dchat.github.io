import { navigate } from "../hooks";

export default function App() {
  return <div onClick={() => navigate(new URL("/thisis", window.location.origin))}>
    Home
  </div>;
}