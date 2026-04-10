import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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

function AppHeader() {
	const [showMenu, setShowMenu] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [activeTheme, setTheme, mounted] = useThemeSwitcher();

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
							{mounted && activeTheme === 'dark' ? (
								<FiMoon className="text-ternary-dark hover:text-gray-400 dark:text-ternary-light dark:hover:text-primary-light text-xl" />
							) : (
								<FiSun className="text-gray-200 hover:text-gray-50 text-xl" />
							)}
						</div>
						<div>
						<button
							onClick={toggleMenu}
							type="button"
							className="focus:outline-none"
							aria-label="Hamburger Menu"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								className="h-7 w-7 fill-current text-secondary-dark dark:text-ternary-light"
							>
								{showMenu ? (
									<FiX className="text-3xl" />
								) : (
									<FiMenu className="text-3xl" />
								)}
							</svg>
						</button>
					</div>
					</div>
				</div>

				{/* Header links small screen */}
				<div
					className={
						showMenu
							? 'block m-0 sm:ml-4 sm:mt-3 md:flex px-5 py-3 sm:p-0 justify-between items-center shadow-lg sm:shadow-none'
							: 'hidden'
					}
				>
					{navLinks.map((link, i) => (
						<div
							key={link.href}
							className={`block text-left text-lg text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light sm:mx-4 mb-2 sm:py-2${i > 0 ? ' border-t-2 pt-3 sm:pt-2 sm:border-t-0 border-primary-light dark:border-secondary-dark' : ''}`}
						>
							<Link href={link.href} aria-label={link.label}>
								{link.label}
							</Link>
						</div>
					))}
					<div className="border-t-2 pt-3 sm:pt-0 sm:border-t-0 border-primary-light dark:border-secondary-dark">
						<Button
							title="Hire Me"
							onClick={showHireMeModal}
							ariaLabel="Hire Me Button"
							className="sm:hidden block text-left text-md shadow-sm rounded-sm mt-2 w-24"
						/>
					</div>
				</div>

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
						{mounted && activeTheme === 'dark' ? (
							<FiMoon className="text-ternary-dark hover:text-gray-400 dark:text-ternary-light dark:hover:text-primary-light text-xl" />
						) : (
							<FiSun className="text-gray-200 hover:text-gray-50 text-xl" />
						)}
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
