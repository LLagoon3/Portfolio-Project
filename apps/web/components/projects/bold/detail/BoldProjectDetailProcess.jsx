import ReactMarkdown from 'react-markdown';
import Reveal from '../../../primitives/Reveal';
import Eyebrow from '../../../primitives/Eyebrow';

// 시안 (Project Detail v2 - Bold.html) 의 process-step 패턴:
// - 카드 배경/둥근 모서리 없이 vertical sequence
// - 각 step 상단 border-top, 마지막 step 만 border-bottom 추가
// - idx label 은 monospace '01 · DECISION' 한 줄, title h3, 본문 markdown 순서
export default function BoldProjectDetailProcess({ steps = [] }) {
	if (!steps.length) return null;

	return (
		<section
			id="process"
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<div className="grid grid-cols-12 gap-6 lg:gap-12">
				<Reveal className="col-span-12 lg:col-span-4">
					<div className="lg:sticky lg:top-32">
						<Eyebrow className="mb-3">— Challenge</Eyebrow>
						<h2
							className="font-general-semibold"
							style={{
								fontSize: 'clamp(2rem, 3.4vw, 3rem)',
								letterSpacing: '-0.04em',
								lineHeight: 1.15,
								wordBreak: 'keep-all',
							}}
						>
							결정의{' '}
							<span
								style={{
									display: 'inline-block',
									color: 'var(--indigo-soft)',
									fontStyle: 'italic',
									paddingRight: '0.1em',
								}}
							>
								흐름
							</span>
							<span style={{ color: 'var(--indigo-soft)' }}>.</span>
						</h2>
						<p
							className="mt-5 text-sm leading-relaxed max-w-xs"
							style={{ color: 'var(--paper-dim)' }}
						>
							&ldquo;무엇을 만들었나&rdquo; 보다 &ldquo;왜 그렇게 결정했나&rdquo; 를 남깁니다.
						</p>
					</div>
				</Reveal>

				<div className="col-span-12 lg:col-span-8 flex flex-col">
					{steps.map((step, idx) => {
						const isLast = idx === steps.length - 1;
						return (
							<Reveal key={`${step.title}-${idx}`} delay={idx * 0.06}>
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
										<span style={{ color: 'var(--indigo-soft)' }}>{step.kind}</span>
									</div>
									<h3
										className="font-general-semibold mb-4"
										style={{
											fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
											letterSpacing: '-0.02em',
											lineHeight: 1.25,
											wordBreak: 'keep-all',
										}}
									>
										{step.title}
									</h3>
									{step.body && (
										<div className="bold-prose">
											<ReactMarkdown>{step.body}</ReactMarkdown>
										</div>
									)}
								</article>
							</Reveal>
						);
					})}
				</div>
			</div>
		</section>
	);
}
