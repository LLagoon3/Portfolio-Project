import { useEffect, useState } from 'react';

const useThemeSwitcher = () => {
	const [mounted, setMounted] = useState(false);
	const [theme, setTheme] = useState('light');

	// 클라이언트 마운트 후 localStorage에서 테마를 읽는다
	useEffect(() => {
		const stored = localStorage.getItem('theme') || 'light';
		setTheme(stored);
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		const root = window.document.documentElement;
		const inactive = theme === 'dark' ? 'light' : 'dark';

		root.classList.remove(inactive);
		root.classList.add(theme);
		localStorage.setItem('theme', theme);
	}, [theme, mounted]);

	const activeTheme = theme === 'dark' ? 'light' : 'dark';
	return [activeTheme, setTheme, mounted];
};

export default useThemeSwitcher;
