import { useState } from 'react';
import Link from 'next/link';
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

	const toggleModal = () => {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('overflow-y-hidden', !showModal);
		}
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
						className="bold-interactive flex items-center gap-3"
						aria-label="홈"
					>
						<span
							className="w-7 h-7 rounded-md grid place-items-center"
							style={{ background: 'var(--indigo)' }}
						>
							<span
								className="text-[11px] text-white"
								style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
							>
								SL
							</span>
						</span>
						<span
							className="font-general-semibold text-base"
							style={{ letterSpacing: '-0.02em', color: 'var(--paper)' }}
						>
							이석호
						</span>
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
