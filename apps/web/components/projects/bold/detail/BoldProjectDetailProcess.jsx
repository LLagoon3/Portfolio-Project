import ReactMarkdown from 'react-markdown';
import Reveal from '../../../primitives/Reveal';
import Eyebrow from '../../../primitives/Eyebrow';

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
						<Eyebrow className="mb-3">— Process</Eyebrow>
						<h2
							className="font-general-semibold"
							style={{
								fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
								letterSpacing: '-0.04em',
								lineHeight: 1.15,
							}}
						>
							결정의 흐름
							<span style={{ color: 'var(--indigo-soft)' }}>.</span>
						</h2>
					</div>
				</Reveal>

				<div className="col-span-12 lg:col-span-8 flex flex-col gap-6 lg:gap-8">
					{steps.map((step, idx) => (
						<Reveal key={`${step.title}-${idx}`} delay={idx * 0.06}>
							<article
								className="rounded-[18px] p-6 lg:p-8"
								style={{
									border: '1px solid var(--line-strong)',
									background:
										'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(99,102,241,0.01))',
								}}
							>
								<div
									className="flex items-center gap-3 mb-4 text-xs uppercase"
									style={{
										fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
										letterSpacing: '0.14em',
										color: 'var(--paper-faint)',
									}}
								>
									<span>{String(idx + 1).padStart(2, '0')}</span>
									<span
										className="px-2 py-0.5 rounded-full"
										style={{
											border: '1px solid var(--line-strong)',
											color: 'var(--indigo-soft)',
										}}
									>
										{step.kind}
									</span>
								</div>
								<h3
									className="font-general-semibold mb-3"
									style={{
										fontSize: 'clamp(1.2rem, 1.8vw, 1.7rem)',
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
					))}
				</div>
			</div>
		</section>
	);
}
