import Link from 'next/link';
import Image from 'next/image';
import Reveal from '../../primitives/Reveal';
import WordReveal from '../../primitives/WordReveal';
import Eyebrow from '../../primitives/Eyebrow';

export default function AboutHero({ name, tagline, profileImage, availability }) {
	const displayName = name || '이석호';
	const heroTagline =
		tagline ||
		'서비스의 동작 원리와 운영 구조를 함께 이해하며, 성능·안정성·운영 효율을 개선하는 백엔드 개발자입니다.';
	const statusLabel = availability;

	return (
		<section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
			{/* 상단 breadcrumb + status row */}
			<Reveal className="flex items-center justify-between mb-10">
				<div className="flex items-center gap-3">
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
					<Eyebrow>About</Eyebrow>
				</div>
				{statusLabel && (
					<div className="hidden sm:flex items-center gap-2">
						<span className="relative flex h-2 w-2">
							<span
								className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
								style={{ background: '#22c55e' }}
							/>
							<span
								className="relative inline-flex rounded-full h-2 w-2"
								style={{ background: '#22c55e' }}
							/>
						</span>
						<Eyebrow>{statusLabel}</Eyebrow>
					</div>
				)}
			</Reveal>

			{/* 거대 이름 — 전체 너비. side-by-side grid 는 portrait(4:5) 가 heading 보다 훨씬
			    길어 위/아래 공백이 항상 컸음. heading 을 full-width 로 빼면 글자 크기가 6.5rem
			    까지 자유롭게 커지고 portrait + tagline 은 아래 row 에서 시각 균형을 잡는다. */}
			<WordReveal
				className="font-general-semibold"
				style={{
					// 가장 긴 줄 '집중하는 개발자,' (9 char ~1em) 기준 동적 폰트 + word-break:
					// keep-all 로 좁은 viewport 의 자모 분리 / 강제 줄꺾임을 차단. container
					// 폭이 lg+ 에서 ~944~1200px 이라 cap 6.5rem (~104px) 까지 안전
					// (line ~9 * 104 * 0.96 = 898px < 944).
					fontSize: 'clamp(1.8rem, calc((100vw - 3rem) / 10), 6.5rem)',
					letterSpacing: '-0.04em',
					lineHeight: 1.3,
					wordBreak: 'keep-all',
				}}
				items={[
					{ text: '문제의 본질에' },
					{ br: true },
					{ text: '집중하는 개발자,' },
					{ br: true },
					// noSep: '이석호' + '입니다.' 사이 공백 없이 자연스러운 한국어 결합.
					{ text: displayName, accent: true, noSep: true },
					{ text: '입니다.' },
				]}
			/>

			{/* portrait + tagline — heading 아래 row 에서 좌우 배치. portrait 는 원래의
			    col-span-4 비례를 그대로 따라 시각 무게 보존, tagline 은 col-span-8 으로 폭 확보. */}
			<div className="mt-14 lg:mt-20 grid grid-cols-12 gap-6 lg:gap-12 items-center">
				<Reveal
					as="p"
					delay={0.24}
					className="col-span-12 lg:col-span-8 font-general-semibold"
					style={{
						fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)',
						lineHeight: 1.35,
						letterSpacing: '-0.02em',
					}}
				>
					{heroTagline}
				</Reveal>
				<Reveal
					delay={0.16}
					className="col-span-12 lg:col-span-4 flex justify-center lg:justify-end"
				>
					<div
						className="relative rounded-[18px] overflow-hidden w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none"
						style={{
							border: '1px solid var(--line-strong)',
							aspectRatio: '4 / 5',
							background:
								'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.04))',
							boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)',
						}}
					>
						{profileImage ? (
							<Image
								src={profileImage}
								alt={`${displayName} 프로필`}
								fill
								sizes="(min-width: 1024px) 33vw, 80vw"
								style={{ objectFit: 'cover' }}
								priority
							/>
						) : null}
						{/* 하단 어둠 veil */}
						<div
							className="absolute inset-0 pointer-events-none"
							style={{
								background:
									'linear-gradient(180deg, transparent 60%, rgba(7,14,23,0.5))',
							}}
							aria-hidden="true"
						/>
						<div
							className="absolute left-[14px] right-[14px] bottom-[14px] z-[2] flex items-end justify-between"
							style={{
								fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
								fontSize: '10px',
								letterSpacing: '0.12em',
								color: 'rgba(255,255,255,0.85)',
							}}
						>
							<span>SEOUL · KST</span>
							<span>BACKEND</span>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
