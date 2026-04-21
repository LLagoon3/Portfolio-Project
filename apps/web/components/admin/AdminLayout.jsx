import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import PagesMetaHead from '../PagesMetaHead';
import Button from '../reusable/Button';
import AdminNav from './AdminNav';

function AdminLayout({ title = 'Admin', children }) {
	const router = useRouter();
	const [loggingOut, setLoggingOut] = useState(false);

	async function handleLogout() {
		if (loggingOut) return;
		setLoggingOut(true);
		try {
			await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
		} catch (err) {
			console.error('[admin] logout failed', err);
		} finally {
			router.replace('/admin/login');
		}
	}

	return (
		<div className="min-h-screen bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light">
			<PagesMetaHead title={`Admin · ${title}`} />
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
					<aside className="w-full sm:w-56 shrink-0 space-y-6">
						<div>
							<p className="font-general-medium text-2xl mb-1">Admin</p>
							<p className="text-sm text-ternary-dark dark:text-ternary-light">
								Lagoon Portfolio
							</p>
						</div>
						<AdminNav />
						<Button
							title={loggingOut ? 'Signing out…' : 'Sign out'}
							variant="secondary"
							onClick={handleLogout}
							disabled={loggingOut}
							className="w-full flex items-center justify-center gap-2"
							ariaLabel="Sign out"
						/>
					</aside>

					<main className="flex-1 min-w-0">
						<header className="mb-6">
							<h1 className="font-general-medium text-3xl">{title}</h1>
						</header>
						<section>{children}</section>
					</main>
				</div>
			</div>
		</div>
	);
}

export default AdminLayout;
