import Reveal from '../primitives/Reveal';
import Eyebrow from '../primitives/Eyebrow';
import PillButton from '../primitives/PillButton';

// italic accent 가 다음 일반체 글자와 겹치는 현상 회피용 inline-block + paddingRight.
// (Hero 의 WordReveal 과 같은 패턴.)
const accentStyle = {
	display: 'inline-block',
	color: 'var(--indigo-soft)',
	fontStyle: 'italic',
	paddingRight: '0.1em',
};

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

	// 디자인 컨벤션: 본문의 첫 번째 쉼표 다음에서 한 번 줄바꿈해 의미 단위를 분리한다.
	// 라군 bio 의 "...이해하며, 성능·..." 케이스에 맞춰 자연스러운 호흡을 만든다.
	// 다른 bio 가 들어올 경우 첫 쉼표 위치가 디자인 의도와 다를 수 있음 — 추후 어드민에서
	// 줄바꿈을 직접 입력 가능하도록 백엔드 확장 검토.
	const renderBody = (raw) => {
		const idx = raw.indexOf(',');
		if (idx < 0) return raw;
		return (
			<>
				{raw.slice(0, idx + 1)}
				<br />
				{raw.slice(idx + 1).trimStart()}
			</>
		);
	};

	return (
		<section
			id="about"
			className="py-24 lg:py-32 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<div className="grid grid-cols-12 gap-6 lg:gap-12">
				<Reveal className="col-span-12 lg:col-span-8">
					<Eyebrow className="mb-4">— About</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
							letterSpacing: '-0.04em',
							lineHeight: 1.15,
						}}
					>
						기능 구현을 넘어
						<br />
						서비스의 <span style={accentStyle}>안정성</span>과
						<br />
						<span style={accentStyle}>유지보수성</span>을
						<br />
						고민합니다.
					</h2>
					<p
						className="leading-relaxed mt-10"
						style={{
							color: 'var(--paper-dim)',
							fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
							maxWidth: '56ch',
						}}
					>
						{renderBody(text)}
					</p>
				</Reveal>
				{/* 우측 col 은 grid row stretch 로 좌측 col 만큼 높이가 늘어나고,
				    그 안에서 CTA 를 vertical center 로 정렬한다 (lg 이상). */}
				<Reveal
					delay={0.16}
					className="col-span-12 lg:col-span-4 flex lg:items-center"
				>
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
				</Reveal>
			</div>
		</section>
	);
}
