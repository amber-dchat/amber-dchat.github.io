import NavigationBar from '@/components/nav';
import { navigate } from '../hooks';
import { Separator } from '@/components/ui/separator';

export default function App() {
	return (
		<div className="w-full">
			<NavigationBar />
			<Separator />
			<div onClick={() => navigate('/this?a=hi')}>Home</div>
		</div>
	);
}
