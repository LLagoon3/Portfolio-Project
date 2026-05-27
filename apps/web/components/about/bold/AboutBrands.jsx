import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';

// 그룹 단위 ({title, techs[]}) 로 묶어 노출. project detail 의 Stack 섹션 동일 패턴.
// 빈 배열이면 섹션 미렌더 — 각 그룹의 techs 가 빈 경우도 그 그룹은 hide.
export default function AboutBrands({ groups = [] }) {
	const visible = groups.filter((g) => g?.techs?.length);
	if (!visible.length) return null;

	const totalTechs = visible.reduce((sum, g) => sum + g.techs.length, 0);

	return (
		<section
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="flex items-end justify-between mb-10 lg:mb-14">
				<div>
					<Eyebrow className="mb-3">— Tech Stack</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)',
							letterSpacing: '-0.04em',
							lineHeight: 0.88,
						}}
					>
						문제를 해결하며 사용한{' '}
						<span
							style={{
								display: 'inline-block',
								color: 'var(--indigo-soft)',
								fontStyle: 'italic',
								paddingRight: '0.1em',
							}}
						>
							기술들
						</span>
						<span style={{ color: 'var(--indigo-soft)' }}>.</span>
					</h2>
				</div>
				<div
					className="hidden md:block text-xs"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						color: 'var(--paper-faint)',
					}}
				>
					{visible.length} GROUPS · {String(totalTechs).padStart(2, '0')} TOOLS
				</div>
			</Reveal>

			<div className="flex flex-col gap-8 lg:gap-10">
				{visible.map((group, idx) => (
					<Reveal key={`${group.title}-${idx}`} delay={idx * 0.06}>
						<div
							className="pt-6"
							style={{ borderTop: '1px solid var(--line-strong)' }}
						>
							<Eyebrow className="mb-4">{group.title}</Eyebrow>
							<div className="flex flex-wrap gap-2 lg:gap-3">
								{group.techs.map((tech) => (
									<span
										key={tech}
										className="inline-flex items-center font-general-medium text-[13px] px-[1.1rem] py-[0.7rem] rounded-full"
										style={{
											border: '1px solid var(--line-strong)',
											color: 'var(--paper)',
											background: 'transparent',
										}}
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					</Reveal>
				))}
			</div>
		</section>
	);
}
