import NavigationBar from '@/components/nav';

import { cn } from '@/lib/utils';

export const LoadingSpinner = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={cn('animate-spin', className)}
	>
		<path d="M21 12a9 9 0 1 1-6.219-8.56" />
	</svg>
);

export function Loading() {
	return (
		<div className="w-full">
			<NavigationBar />

			<div className="h-[calc(100vh-6rem)] flex items-center text-center justify-center">
				<LoadingSpinner className="w-[15vh] h-[15vh]" />
			</div>
		</div>
	);
}
