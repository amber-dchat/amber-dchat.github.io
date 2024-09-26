import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import Sidebar from '.';

export default function MobileSidebar({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent side="left">
				<SheetHeader>
					<SheetTitle>Friends</SheetTitle>
					<Sidebar />
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
