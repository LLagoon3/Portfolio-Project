const FormInput = ({
	inputLabel,
	labelFor,
	inputType,
	inputId,
	inputName,
	placeholderText,
	ariaLabelName,
	value,
	onChange,
	// 기본값 true 로 기존 사용처 (Contact 폼 등) 호환 유지. admin 의 선택 필드는
	// required={false} 로 명시해서 빈 값 저장 허용.
	required = true,
}) => {
	return (
		<div className="font-general-regular mb-4">
			{inputLabel && (
				<label
					className="block text-lg text-primary-dark dark:text-primary-light mb-1"
					htmlFor={labelFor}
				>
					{inputLabel}
				</label>
			)}
			<input
				className="w-full px-5 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-ternary-dark rounded-md shadow-sm text-md"
				type={inputType}
				id={inputId}
				name={inputName}
				placeholder={placeholderText}
				aria-label={ariaLabelName}
				value={value}
				onChange={onChange}
				required={required}
			/>
		</div>
	);
};

export default FormInput;
