import { UserProvider } from '@/hooks/user/useMainUser';
import { usePage } from '@/hooks';
import { Toaster } from '@/components/ui/sonner';

import './index.css';

export default function App() {
	return <UserProvider>
		<Toaster />
		{usePage()}
	</UserProvider>;
}
