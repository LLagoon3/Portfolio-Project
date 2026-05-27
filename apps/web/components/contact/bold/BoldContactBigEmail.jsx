import { useState } from 'react';
import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';
import Toast from '../../primitives/Toast';

// Home ContactCTA 의 동적 폰트 + 클립보드 복사 + Toast 패턴 그대로.
const FALLBACK_EMAIL =
	process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'choonarm3@gmail.com';

export default function BoldContactBigEmail({ email }) {
	const target = email || FALLBACK_EMAIL;
	const [toastVisible, setToastVisible] = useState(false);

	const handleClick = () => {
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard
				.writeText(target)
				.then(() => setToastVisible(true))
				.catch(() => undefined);
		}
	};

	return (
		<section
			className="py-16 lg:py-20 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal>
				<Eyebrow className="mb-6">— Email</Eyebrow>
				<a
					href={`mailto:${target}`}
					onClick={handleClick}
					className="bold-interactive block font-general-semibold hover:opacity-80 transition-opacity break-words"
					style={{
						// Home ContactCTA 와 동일한 calc 수식 (글자수 + 화면 너비 기반)
						fontSize: `min(8rem, calc((100vw - 3rem) / ${target.length + 1} / 0.7))`,
						letterSpacing: '-0.05em',
						lineHeight: 1,
						color: 'var(--paper)',
					}}
				>
					{target}
					<span style={{ color: 'var(--indigo-soft)' }}>.</span>
				</a>
			</Reveal>
			<Toast
				visible={toastVisible}
				message="이메일 주소가 복사됐어요"
				onClose={() => setToastVisible(false)}
			/>
		</section>
	);
}
