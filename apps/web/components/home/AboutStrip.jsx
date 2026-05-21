import Reveal from '../primitives/Reveal';
import Eyebrow from '../primitives/Eyebrow';
import PillButton from '../primitives/PillButton';

export default function AboutStrip({ bioFirst }) {
	// bio[0] 가 마크다운 헤더(`## 1. 한 줄 소개`) 로 시작할 수 있어 평문 렌더 시
	// 헤더가 그대로 노출된다. 가벼운 분리로 `#` 시작 라인만 skip 하고 본문만 남긴다.
	// 코드 블록 안의 `#` 까지 영향받지만 라군 bio 에 해당 케이스 없음 — 필요 시 react-markdown 도입.
	const stripMarkdownHeaders = (raw) =>
		(raw || '')
			.split('\n')
			.filter((line) => !line.trim().startsWith('#'))
			.join('\n')
			.trim();

	const text =
		stripMarkdownHeaders(bioFirst) ||
		'서비스의 동작 원리와 운영 구조를 함께 이해하며, 성능·안정성·운영 효율을 개선하는 백엔드 개발자입니다.';

	return (
		<section
			id="about"
			className="py-24 lg:py-32 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<div className="grid grid-cols-12 gap-6 lg:gap-12">
				<Reveal className="col-span-12 lg:col-span-5">
					<Eyebrow className="mb-4">— About</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
							letterSpacing: '-0.04em',
							lineHeight: 1,
						}}
					>
						기능 구현을 넘어
						<br />
						<span style={{ color: 'var(--indigo-soft)', fontStyle: 'italic' }}>
							서비스의 안정성과
						</span>
						<br />
						유지보수성을 고민합니다.
					</h2>
				</Reveal>
				<Reveal delay={0.16} className="col-span-12 lg:col-span-7">
					<p
						className="leading-relaxed"
						style={{
							color: 'var(--paper-dim)',
							fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
							maxWidth: '56ch',
						}}
					>
						{text}
					</p>

					<div className="mt-10">
						<PillButton variant="ghost" as="link" href="/about" ariaLabel="About 더 보기">
							<span>더 알아보기</span>
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
					</div>
				</Reveal>
			</div>
		</section>
	);
}
