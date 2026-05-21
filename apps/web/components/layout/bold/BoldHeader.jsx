import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoLight from '../../../public/images/logo-light.svg';
import logoDark from '../../../public/images/logo-dark.svg';
import useThemeSwitcher from '../../../hooks/useThemeSwitcher';
import HireMeModal from '../../HireMeModal';

const navLinks = [
	{ href: '/projects', label: 'Projects' },
	{ href: '/about', label: 'About' },
	{ href: '/contact', label: 'Contact', xsHide: true },
];

export default function BoldHeader() {
	const [activeTheme, setTheme, mounted] = useThemeSwitcher();
	const [showModal, setShowModal] = useState(false);

	// showModal 변화에 따라 <html> overflow-y-hidden 동기화.
	// unmount 시점에도 반드시 해제 (모달 열린 상태로 페이지 이동 시 lock 잔존 방지).
	useEffect(() => {
		if (typeof document === 'undefined') return undefined;
		const root = document.documentElement;
		root.classList.toggle('overflow-y-hidden', showModal);
		return () => {
			root.classList.remove('overflow-y-hidden');
		};
	}, [showModal]);

	const toggleModal = () => {
		setShowModal((v) => !v);
	};

	return (
		<>
			<header
				className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b"
				style={{
					background: 'color-mix(in oklab, var(--ink) 70%, transparent)',
					borderColor: 'var(--line)',
				}}
			>
				<nav className="max-w-[1640px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
					<Link
						href="/"
						className="bold-interactive flex items-center"
						aria-label="홈"
					>
						{/* 기존 DefaultLayout 의 AppHeader 와 동일한 로고 swap 패턴.
						    useThemeSwitcher 의 activeTheme 가 "다음 토글 값" 이라
						    activeTheme==='dark' = 현재 light → 어두운 글자 로고(logoDark) 가 적절. */}
						<Image
							src={mounted && activeTheme === 'dark' ? logoDark : logoLight}
							alt="Lagoon Portfolio"
							className="w-28 cursor-pointer"
							width={150}
							height={120}
							priority
						/>
					</Link>

					<div className="flex items-center gap-3 sm:gap-8 text-xs sm:text-sm">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`bold-interactive transition ${link.xsHide ? 'hidden xs:inline' : ''}`}
								style={{ color: 'var(--paper-dim)' }}
								onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--paper)')}
								onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--paper-dim)')}
							>
								{link.label}
							</Link>
						))}
					</div>

					<div className="flex items-center gap-2 sm:gap-3">
						<button
							type="button"
							onClick={() => setTheme(activeTheme)}
							aria-label="테마 전환"
							className="bold-interactive text-xs rounded-full px-2.5 sm:px-3 py-1.5 transition"
							style={{
								fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
								color: 'var(--paper-dim)',
								border: '1px solid var(--line-strong)',
							}}
						>
							<span className="hidden sm:inline">
								{mounted ? (activeTheme === 'dark' ? 'LIGHT' : 'DARK') : 'DARK / LIGHT'}
							</span>
							<span className="sm:hidden" aria-hidden="true">◐</span>
						</button>
						<button
							type="button"
							onClick={toggleModal}
							className="bold-interactive hidden sm:inline-flex items-center gap-2 text-sm font-general-medium px-4 py-1.5 rounded-full"
							style={{ background: 'var(--indigo)', color: 'white' }}
							aria-label="Hire Me"
						>
							Hire Me
							<svg
								className="w-3.5 h-3.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden="true"
							>
								<path d="M7 17L17 7M9 7h8v8" />
							</svg>
						</button>
					</div>
				</nav>
			</header>
			{showModal && (
				<HireMeModal onClose={toggleModal} onRequest={toggleModal} />
			)}
		</>
	);
}
