import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import Sidebar from "."

export default function MobileSidebar() {
  return <Sheet>
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle>Friends</SheetTitle>
        <Sidebar />
      </SheetHeader>
    </SheetContent>
  </Sheet>

}