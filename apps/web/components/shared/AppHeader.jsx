import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSun, FiMoon, FiX, FiMenu } from 'react-icons/fi';
import HireMeModal from '../HireMeModal';
import Button from '../reusable/Button';
import logoLight from '../../public/images/logo-light.svg';
import logoDark from '../../public/images/logo-dark.svg';
import useThemeSwitcher from '../../hooks/useThemeSwitcher';

const navLinks = [
	{ href: '/projects', label: 'Projects' },
	{ href: '/about', label: 'About Me' },
	{ href: '/contact', label: 'Contact' },
];

// 테마 토글 버튼 안에 들어가는 아이콘. 햄버거와 동일한 rotate+fade 크로스
// 트랜지션을 쓰되 dark ↔ light 전환 특성상 mounted 가 false 일 땐 SSR 결과와
// 같은 sun 아이콘을 그대로 보여주고 애니메이션은 최초 전환부터 적용한다.
function ThemeSwitchIcon({ mounted, activeTheme }) {
	const isDark = mounted && activeTheme === 'dark';
	return (
		<span className="relative block w-5 h-5">
			<AnimatePresence initial={false} mode="wait">
				{isDark ? (
					<motion.span
						key="moon"
						initial={{ rotate: -90, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						exit={{ rotate: 90, opacity: 0 }}
						transition={{ duration: 0.2, ease: 'easeInOut' }}
						className="absolute inset-0 flex items-center justify-center"
					>
						<FiMoon className="text-ternary-dark hover:text-gray-400 dark:text-ternary-light dark:hover:text-primary-light text-xl" />
					</motion.span>
				) : (
					<motion.span
						key="sun"
						initial={{ rotate: 90, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						exit={{ rotate: -90, opacity: 0 }}
						transition={{ duration: 0.2, ease: 'easeInOut' }}
						className="absolute inset-0 flex items-center justify-center"
					>
						<FiSun className="text-gray-200 hover:text-gray-50 text-xl" />
					</motion.span>
				)}
			</AnimatePresence>
		</span>
	);
}

function AppHeader() {
	const router = useRouter();
	const [showMenu, setShowMenu] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [activeTheme, setTheme, mounted] = useThemeSwitcher();

	// 라우트 이동이 시작될 때 모바일 메뉴를 닫는다. AnimatePresence exit
	// 트랜지션이 페이지 전환 애니메이션과 병렬로 재생돼 자연스럽게 접힌다.
	useEffect(() => {
		const handleRouteChange = () => setShowMenu(false);
		router.events.on('routeChangeStart', handleRouteChange);
		return () => router.events.off('routeChangeStart', handleRouteChange);
	}, [router.events]);

	function toggleMenu() {
		if (!showMenu) {
			setShowMenu(true);
		} else {
			setShowMenu(false);
		}
	}

	function showHireMeModal() {
		if (!showModal) {
			if (typeof document !== 'undefined') {
				document.documentElement.classList.add('overflow-y-hidden');
			}
			setShowModal(true);
		} else {
			if (typeof document !== 'undefined') {
				document.documentElement.classList.remove('overflow-y-hidden');
			}
			setShowModal(false);
		}
	}

	return (
		<motion.nav
			initial={false}
			animate={{ opacity: 1 }}
			id="nav"
			className="sm:container sm:mx-auto"
		>
			{/* Header */}
			<div className="z-10 max-w-screen-lg xl:max-w-screen-xl block sm:flex sm:justify-between sm:items-center py-6">
				{/* Header menu links and small screen hamburger menu */}
				<div className="flex justify-between items-center px-4 sm:px-0">
					<div>
						<Link href="/">
							<Image
								src={mounted && activeTheme === 'dark' ? logoDark : logoLight}
								className="w-36 cursor-pointer"
								alt="Logo"
								width={150}
								height={120}
							/>
						</Link>
					</div>

					{/* Theme switcher + hamburger menu small screen */}
					<div className="flex items-center gap-3 sm:hidden">
						<div
							onClick={() => setTheme(activeTheme)}
							aria-label="Theme Switcher"
							className="bg-primary-light dark:bg-ternary-dark p-3 shadow-sm rounded-xl cursor-pointer"
						>
							<ThemeSwitchIcon mounted={mounted} activeTheme={activeTheme} />
						</div>
						<div>
						<button
							onClick={toggleMenu}
							type="button"
							className="focus:outline-none text-secondary-dark dark:text-ternary-light text-3xl relative w-8 h-8"
							aria-label="Hamburger Menu"
							aria-expanded={showMenu}
						>
							<AnimatePresence initial={false} mode="wait">
								{showMenu ? (
									<motion.span
										key="close"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.15, ease: 'easeInOut' }}
										className="absolute inset-0 flex items-center justify-center"
									>
										<FiX />
									</motion.span>
								) : (
									<motion.span
										key="open"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{ duration: 0.15, ease: 'easeInOut' }}
										className="absolute inset-0 flex items-center justify-center"
									>
										<FiMenu />
									</motion.span>
								)}
							</AnimatePresence>
						</button>
					</div>
					</div>
				</div>

				{/* Header links small screen */}
				<AnimatePresence initial={false}>
					{showMenu && (
						<motion.div
							key="mobile-menu"
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.22, ease: 'easeInOut' }}
							className="overflow-hidden sm:hidden"
						>
							<div className="block px-5 py-3 shadow-lg">
								{navLinks.map((link, i) => (
									<div
										key={link.href}
										className={`block text-left text-lg text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light mb-2${i > 0 ? ' border-t-2 pt-3 border-primary-light dark:border-secondary-dark' : ''}`}
									>
										<Link href={link.href} aria-label={link.label}>
											{link.label}
										</Link>
									</div>
								))}
								<div className="border-t-2 pt-3 border-primary-light dark:border-secondary-dark">
									<Button
										title="Hire Me"
										onClick={showHireMeModal}
										ariaLabel="Hire Me Button"
										className="block text-left text-md shadow-sm rounded-sm mt-2 w-24"
									/>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Header links large screen */}
				<div className="font-general-medium hidden m-0 sm:ml-4 mt-5 sm:mt-3 sm:flex p-5 sm:p-0 justify-center items-center shadow-lg sm:shadow-none">
					{navLinks.map((link) => (
						<div
							key={link.href}
							className="block text-left text-lg font-medium text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light sm:mx-4 mb-2 sm:py-2"
						>
							<Link href={link.href} aria-label={link.label}>
								{link.label}
							</Link>
						</div>
					))}
				</div>

				{/* Header right section buttons */}
				<div className="hidden sm:flex justify-between items-center flex-col md:flex-row">
					<div className="hidden md:flex">
						<Button
							title="Hire Me"
							onClick={showHireMeModal}
							ariaLabel="Hire Me Button"
							className="text-md shadow-sm"
						/>
					</div>

					{/* Theme switcher large screen */}
					<div
						onClick={() => setTheme(activeTheme)}
						aria-label="Theme Switcher"
						className="ml-8 bg-primary-light dark:bg-ternary-dark p-3 shadow-sm rounded-xl cursor-pointer"
					>
						<ThemeSwitchIcon mounted={mounted} activeTheme={activeTheme} />
					</div>
				</div>
			</div>
			<div>
				{showModal ? (
					<HireMeModal
						onClose={showHireMeModal}
						onRequest={showHireMeModal}
					/>
				) : null}
			</div>
		</motion.nav>
	);
}

export default AppHeader;
