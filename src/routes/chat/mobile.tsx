import Chat from "./components/chat";
import MobileSidebar from "./components/sidebar/mobileSidebar";

export default function Mobile() {
	return (
		<div className="h-full w-full flex">
			<MobileSidebar />

			<Chat />
		</div>
	);
}
