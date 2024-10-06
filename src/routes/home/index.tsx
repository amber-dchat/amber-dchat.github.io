import { isTauri } from "../chat/isTauri";
import TauriLogin from "./tauriLogin";

export default function Home() {
	if (isTauri) {
		return <TauriLogin />
	}

	return <div>
		Home
	</div>;
}
