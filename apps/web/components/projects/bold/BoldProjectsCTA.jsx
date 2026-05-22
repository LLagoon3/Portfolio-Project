import Link from 'next/link';
import Reveal from '../../primitives/Reveal';
import WordReveal from '../../primitives/WordReveal';
import Eyebrow from '../../primitives/Eyebrow';
import PillButton from '../../primitives/PillButton';

export default function BoldProjectsCTA() {
	return (
		<section
			className="py-20 lg:py-28 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="mb-6">
				<Eyebrow>— Have a project?</Eyebrow>
			</Reveal>

			<WordReveal
				className="font-general-semibold"
				style={{
					fontSize: 'clamp(2.6rem, 11vw, 12rem)',
					letterSpacing: '-0.04em',
					lineHeight: 1.0,
				}}
				items={[{ text: '같이' }, { text: '만들어요.', accent: true }]}
			/>

			<Reveal delay={0.16} className="mt-12">
				<PillButton href="/contact" variant="cta" ariaLabel="문의하기로 이동">
					<span>메일로 시작하기</span>
					<svg
						className="w-4 h-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden="true"
					>
						<path d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</PillButton>
			</Reveal>
		</section>
	);
}
