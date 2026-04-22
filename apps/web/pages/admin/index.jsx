import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';
import { requireAuth } from '../../lib/admin/requireAuth';

const SECTIONS = [
	{
		href: '/admin/projects',
		title: 'Projects',
		desc: '포트폴리오 프로젝트 목록을 관리합니다.',
	},
	{
		href: '/admin/about',
		title: 'About',
		desc: '자기소개와 프로필 이미지를 편집합니다.',
	},
	{
		href: '/admin/contact',
		title: 'Contact',
		desc: '연락 폼 제출 내역을 확인하고 상태를 관리합니다.',
	},
];

function AdminDashboard() {
	return (
		<AdminLayout title="Dashboard">
			<p className="font-general-regular text-lg text-ternary-dark dark:text-ternary-light mb-8">
				관리할 영역을 선택하세요.
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
				{SECTIONS.map(({ href, title, desc }) => (
					<Link
						key={href}
						href={href}
						className="block rounded-xl border border-gray-200 dark:border-secondary-dark bg-secondary-light dark:bg-secondary-dark p-5 hover:shadow-md duration-300"
					>
						<p className="font-general-medium text-xl text-primary-dark dark:text-primary-light mb-1">
							{title}
						</p>
						<p className="font-general-regular text-sm text-ternary-dark dark:text-ternary-light">
							{desc}
						</p>
					</Link>
				))}
			</div>
		</AdminLayout>
	);
}

export const getServerSideProps = requireAuth();

export default AdminDashboard;
