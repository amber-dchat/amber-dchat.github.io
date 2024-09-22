import NavigationBar from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { FcBiohazard } from "react-icons/fc";
import { navigate } from "./hooks";

export default function App() {
  return <div className="w-full">
    <NavigationBar />
    <Separator />

    <div className="w-full mt-12 flex flex-col text-center justify-center items-center">
      <FcBiohazard size="8em" />
      <h1 className="mt-3 text-4xl font-bold glitch">BIOHAZARD!!!! Error 404</h1>
      <h2 className="mt-2 text-xl glitch">Seems like you got lost and entered a Neclear Waste facility, {"here's"} the button leading back to safety</h2>


      <Button className="mt-5 text-6xl font-extrabold h-24 home_font" onClick={() => navigate("/")}>
        HOME
      </Button>
    </div>
  </div>;
}