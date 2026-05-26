import ReactMarkdown from 'react-markdown';
import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';

// admin About 의 faqs 입력이 있으면 노출. 빈 배열이면 섹션 자체 미렌더.
// 시안의 Process 톤 — vertical sequence + border-t 매 row + 마지막 border-b.
// answer 는 markdown 허용 (bold-prose 로 렌더).
export default function BoldContactFaq({ faqs = [] }) {
	if (!faqs.length) return null;

	return (
		<section
			id="faq"
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="mb-10 lg:mb-12">
				<Eyebrow className="mb-3">— FAQ</Eyebrow>
				<h2
					className="font-general-semibold"
					style={{
						fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
						letterSpacing: '-0.04em',
						lineHeight: 1.15,
						wordBreak: 'keep-all',
					}}
				>
					자주 받는{' '}
					<span
						style={{
							display: 'inline-block',
							color: 'var(--indigo-soft)',
							fontStyle: 'italic',
							paddingRight: '0.1em',
						}}
					>
						질문
					</span>
					<span style={{ color: 'var(--indigo-soft)' }}>.</span>
				</h2>
			</Reveal>

			<div className="flex flex-col">
				{faqs.map((faq, idx) => {
					const isLast = idx === faqs.length - 1;
					return (
						<Reveal key={`${faq.question}-${idx}`} delay={idx * 0.06}>
							<article
								className={`py-8 lg:py-10 border-t${isLast ? ' border-b' : ''}`}
								style={{ borderColor: 'var(--line-strong)' }}
							>
								<div
									className="mb-4 text-xs uppercase"
									style={{
										fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
										letterSpacing: '0.14em',
										color: 'var(--paper-faint)',
									}}
								>
									{String(idx + 1).padStart(2, '0')}
									<span
										className="mx-2"
										style={{ color: 'var(--line-strong)' }}
									>
										·
									</span>
									<span style={{ color: 'var(--indigo-soft)' }}>QUESTION</span>
								</div>
								<h3
									className="font-general-semibold mb-4"
									style={{
										fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
										letterSpacing: '-0.02em',
										lineHeight: 1.3,
										wordBreak: 'keep-all',
									}}
								>
									{faq.question}
								</h3>
								<div className="bold-prose" style={{ wordBreak: 'keep-all' }}>
									<ReactMarkdown>{faq.answer}</ReactMarkdown>
								</div>
							</article>
						</Reveal>
					);
				})}
			</div>
		</section>
	);
}
