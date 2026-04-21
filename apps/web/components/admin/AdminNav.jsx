import Link from 'next/link';
import { useRouter } from 'next/router';
import {
	FiBookOpen,
	FiInbox,
	FiLayers,
	FiUser,
} from 'react-icons/fi';

const NAV_ITEMS = [
	{ href: '/admin', label: 'Dashboard', icon: FiLayers, match: (p) => p === '/admin' },
	{ href: '/admin/projects', label: 'Projects', icon: FiBookOpen, match: (p) => p.startsWith('/admin/projects') },
	{ href: '/admin/about', label: 'About', icon: FiUser, match: (p) => p.startsWith('/admin/about') },
	{ href: '/admin/contact', label: 'Contact', icon: FiInbox, match: (p) => p.startsWith('/admin/contact') },
];

function AdminNav() {
	const router = useRouter();

	return (
		<nav className="flex flex-col gap-1 font-general-medium">
			{NAV_ITEMS.map(({ href, label, icon: Icon, match }) => {
				const active = match(router.pathname);
				return (
					<Link
						key={href}
						href={href}
						className={`flex items-center gap-3 px-3 py-2 rounded-md duration-300 ${
							active
								? 'bg-indigo-500 text-white'
								: 'text-primary-dark dark:text-primary-light hover:bg-ternary-light dark:hover:bg-ternary-dark'
						}`}
					>
						<Icon className="w-5 h-5" />
						<span>{label}</span>
					</Link>
				);
			})}
		</nav>
	);
}

export default AdminNav;
