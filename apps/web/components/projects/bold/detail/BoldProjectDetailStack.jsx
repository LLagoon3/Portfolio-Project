import Reveal from '../../../primitives/Reveal';
import Eyebrow from '../../../primitives/Eyebrow';

export default function BoldProjectDetailStack({ groups = [] }) {
	// 기존 single-project 페이지가 technologies[0] 만 렌더하던 버그를 여기서 해소 — 모든 그룹 표시.
	const visible = groups.filter((g) => g?.techs?.length);
	if (!visible.length) return null;

	return (
		<section
			id="stack"
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<div className="grid grid-cols-12 gap-6 lg:gap-12">
				<Reveal className="col-span-12 lg:col-span-4">
					<div className="lg:sticky lg:top-32">
						<Eyebrow className="mb-3">— Stack</Eyebrow>
						<h2
							className="font-general-semibold"
							style={{
								fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
								letterSpacing: '-0.04em',
								lineHeight: 1.15,
							}}
						>
							사용한 도구들
							<span style={{ color: 'var(--indigo-soft)' }}>.</span>
						</h2>
					</div>
				</Reveal>

				<div className="col-span-12 lg:col-span-8 flex flex-col gap-8 lg:gap-10">
					{visible.map((group) => (
						<Reveal key={group.title}>
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
			</div>
		</section>
	);
}
