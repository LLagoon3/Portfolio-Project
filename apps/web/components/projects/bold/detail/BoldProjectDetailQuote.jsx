import Reveal from '../../../primitives/Reveal';
import Eyebrow from '../../../primitives/Eyebrow';

// quote 가 null 이면 섹션 자체 미렌더.
export default function BoldProjectDetailQuote({ quote }) {
	if (!quote?.text) return null;

	return (
		<section
			id="quote"
			className="py-20 lg:py-28 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="text-center">
				<Eyebrow className="mb-6 inline-block">— Quote</Eyebrow>
				<blockquote
					className="font-general-semibold mx-auto max-w-4xl"
					style={{
						fontSize: 'clamp(1.6rem, 3.4vw, 2.8rem)',
						lineHeight: 1.35,
						letterSpacing: '-0.02em',
						fontStyle: 'italic',
						color: 'var(--paper)',
						wordBreak: 'keep-all',
					}}
				>
					<span style={{ color: 'var(--indigo-soft)' }}>“</span>
					{quote.text}
					<span style={{ color: 'var(--indigo-soft)' }}>”</span>
				</blockquote>
				{quote.author && (
					<div
						className="mt-6 text-xs uppercase"
						style={{
							fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
							letterSpacing: '0.14em',
							color: 'var(--paper-faint)',
						}}
					>
						— {quote.author}
					</div>
				)}
			</Reveal>
		</section>
	);
}
