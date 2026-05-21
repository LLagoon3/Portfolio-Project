import Reveal from '../primitives/Reveal';
import WordReveal from '../primitives/WordReveal';
import Eyebrow from '../primitives/Eyebrow';
import PillButton from '../primitives/PillButton';

// 이력서 외부 링크 — 메모리(portfolio-resume-link.md) 참고. PDF 아닌 Notion.
const RESUME_URL =
	'https://dear-sawfish-e55.notion.site/15fd6568ef4b80509953d6e7648258dd?source=copy_link';

export default function HomeHero({ tagline }) {
	const safeTagline = tagline || '빠른 구현과 동시에, 안정적으로 운영될 구조를 만드는 데 집중합니다.';

	return (
		<section id="hero" className="pt-36 lg:pt-48 pb-20 lg:pb-28 relative">
			{/* status row */}
			<Reveal className="flex items-center justify-between gap-6 mb-12">
				<div className="flex items-center gap-3">
					<span className="relative flex h-2.5 w-2.5">
						<span
							className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
							style={{ background: '#22c55e' }}
						/>
						<span
							className="relative inline-flex rounded-full h-2.5 w-2.5"
							style={{ background: '#22c55e' }}
						/>
					</span>
					<Eyebrow>신입 채용 검토 중</Eyebrow>
				</div>
				<div className="hidden sm:block">
					<Eyebrow>서울, 한국 · KST</Eyebrow>
				</div>
			</Reveal>

			{/* 거대 이름 */}
			<WordReveal
				className="font-general-semibold"
				style={{
					fontSize: 'clamp(2.6rem, 12vw, 13.5rem)',
					letterSpacing: '-0.05em',
					lineHeight: 0.88,
				}}
				items={[
					{ text: '이석호' },
					{ br: true },
					{ text: '포트폴리오', accent: true },
				]}
			/>

			{/* tagline + CTA */}
			<div className="mt-12 grid grid-cols-12 gap-6 lg:gap-10 items-end">
				<Reveal
					as="p"
					delay={0.16}
					className="col-span-12 lg:col-span-7 font-general-semibold"
					style={{
						fontSize: 'clamp(1.4rem, 2.4vw, 2.4rem)',
						lineHeight: 1.18,
						letterSpacing: '-0.02em',
					}}
				>
					{safeTagline}
				</Reveal>
				<Reveal
					delay={0.24}
					className="col-span-12 lg:col-span-5 flex flex-wrap items-center gap-3 lg:justify-end"
				>
					<PillButton variant="ghost" href="#work" ariaLabel="작업 보기">
						<span>작업 보기</span>
						<svg
							className="w-4 h-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<path d="M12 5v14M5 12l7 7 7-7" />
						</svg>
					</PillButton>
					<PillButton
						variant="cta"
						href={RESUME_URL}
						target="_blank"
						rel="noopener noreferrer"
						ariaLabel="이력서 보기 (새 탭)"
					>
						<span>이력서 보기</span>
						<svg
							className="w-4 h-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<path d="M7 17L17 7M9 7h8v8" />
						</svg>
					</PillButton>
				</Reveal>
			</div>
		</section>
	);
}
