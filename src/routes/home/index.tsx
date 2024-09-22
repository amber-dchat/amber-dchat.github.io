import { navigate } from "../hooks";

export default function App() {
  return <div onClick={() => navigate(new URL("/thisis gonna be 404", window.location.origin))}>
    Home
  </div>;
}