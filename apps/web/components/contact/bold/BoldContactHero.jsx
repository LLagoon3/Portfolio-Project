import Link from 'next/link';
import Reveal from '../../primitives/Reveal';
import WordReveal from '../../primitives/WordReveal';
import Eyebrow from '../../primitives/Eyebrow';

export default function BoldContactHero() {
	return (
		<section className="pt-28 lg:pt-40 pb-16 lg:pb-20">
			{/* 상단 breadcrumb */}
			<Reveal className="flex items-center gap-3 mb-10">
				<Link
					href="/"
					className="bold-interactive flex items-center gap-1.5 transition"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						fontSize: '0.75rem',
						color: 'var(--paper-faint)',
					}}
				>
					<svg
						className="w-3 h-3"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden="true"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					홈
				</Link>
				<span className="w-6 h-px" style={{ background: 'var(--line-strong)' }} />
				<Eyebrow>Contact</Eyebrow>
			</Reveal>

			{/* 거대 이름 */}
			<WordReveal
				className="font-general-semibold"
				style={{
					fontSize: 'clamp(2.6rem, 11vw, 12rem)',
					letterSpacing: '-0.04em',
					// 1.0 은 12rem fontSize 의 italic 한글 (예: 함께할/기회를) batchim 이
					// overflow-hidden 박스 하단으로 잘리는 경계. 1.15 로 살짝 키워 fit.
					lineHeight: 1.15,
				}}
				items={[
					{ text: '함께할', accent: true },
					{ text: '기회를', accent: true },
					{ br: true },
					{ text: '기다립니다.' },
				]}
			/>

			{/* tagline */}
			<Reveal
				as="p"
				delay={0.24}
				className="mt-12 lg:mt-16 max-w-3xl font-general-semibold"
				style={{
					fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)',
					lineHeight: 1.2,
					letterSpacing: '-0.02em',
				}}
			>
				답장은 가능한 한 24시간 안에 드립니다.
			</Reveal>
		</section>
	);
}
