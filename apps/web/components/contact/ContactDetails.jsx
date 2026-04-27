import { FiPhone, FiMapPin, FiMail } from 'react-icons/fi';

// address / email / phone 은 About 싱글톤에서 관리되며 값이 없는 항목은 렌더하지 않는다.
function ContactDetails({ address, email, phone }) {
	const entries = [
		address && { key: 'address', icon: <FiMapPin />, label: address, href: null },
		email && {
			key: 'email',
			icon: <FiMail />,
			label: email,
			href: `mailto:${email}`,
		},
		phone && {
			key: 'phone',
			icon: <FiPhone />,
			label: phone,
			href: `tel:${phone.replace(/\s+/g, '')}`,
		},
	].filter(Boolean);

	return (
		<div className="w-full lg:w-1/2">
			<div className="text-left max-w-xl px-6">
				<h2 className="font-general-medium text-2xl text-primary-dark dark:text-primary-light mt-12 mb-8">
					Contact details
				</h2>
				{entries.length === 0 ? (
					<p className="font-general-regular text-ternary-dark dark:text-ternary-light">
						연락처 정보가 아직 등록되지 않았습니다.
					</p>
				) : (
					<ul>
						{entries.map((entry) => (
							<li className="flex" key={entry.key}>
								<i className="text-2xl text-neutral-500 dark:text-neutral-400 mr-4 mt-1">
									{entry.icon}
								</i>
								{entry.href ? (
									<a
										href={entry.href}
										className="text-lg mb-4 text-ternary-dark dark:text-ternary-light hover:text-indigo-500 dark:hover:text-indigo-400 break-all"
									>
										{entry.label}
									</a>
								) : (
									<span className="text-lg mb-4 text-ternary-dark dark:text-ternary-light break-words">
										{entry.label}
									</span>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

export default ContactDetails;
