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

			{/* 거대 이름 + portrait — side-by-side. portrait(4:5) 가 3-line heading 보다 길어
			    items-center 시 위/아래 약간의 공백은 남지만, lineHeight 1.55 로 heading 영역을
			    최대한 채워 gap 을 최소화. col-span-8 폭에서 9-char 라인이 4-line 으로 깨지지
			    않도록 fontSize cap 은 4.5rem (line ~9em * 4.5rem * 0.9 ≈ 36em < 597px). */}
			<div className="grid grid-cols-12 gap-6 lg:gap-12 items-center">
				<div className="col-span-12 lg:col-span-8">
					<WordReveal
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(2rem, calc((100vw - 3rem) / 8), 4.5rem)',
							letterSpacing: '-0.04em',
							lineHeight: 1.55,
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
				</div>
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

			{/* tagline — heading + portrait row 아래 (원래 위치) */}
			<Reveal
				as="p"
				delay={0.24}
				className="mt-12 lg:mt-16 max-w-3xl font-general-semibold"
				style={{
					fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)',
					lineHeight: 1.35,
					letterSpacing: '-0.02em',
				}}
			>
				{heroTagline}
			</Reveal>
		</section>
	);
}
