const baseStyles =
	'font-general-medium rounded-md duration-500 focus:ring-1 focus:ring-indigo-900';

const variants = {
	primary:
		'text-white bg-indigo-500 hover:bg-indigo-600',
	secondary:
		'bg-gray-600 text-primary-light hover:bg-ternary-dark dark:bg-gray-200 dark:text-secondary-dark dark:hover:bg-primary-light',
};

const sizes = {
	md: 'px-4 sm:px-6 py-2 sm:py-2.5',
	lg: 'px-7 py-4',
};

function Button({
	title,
	variant = 'primary',
	size = 'md',
	type = 'button',
	onClick,
	disabled,
	className = '',
	ariaLabel,
}) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel}
			className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
		>
			{title}
		</button>
	);
}

export default Button;
