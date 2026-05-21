import Link from 'next/link';
import Image from 'next/image';
import Reveal from '../../primitives/Reveal';
import WordReveal from '../../primitives/WordReveal';
import Eyebrow from '../../primitives/Eyebrow';

export default function AboutHero({ name, tagline, profileImage }) {
	const displayName = name || '이석호';
	const heroTagline =
		tagline ||
		'서비스의 동작 원리와 운영 구조를 함께 이해하며, 성능·안정성·운영 효율을 개선하는 백엔드 개발자입니다.';

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
					<Eyebrow>About — 2026</Eyebrow>
				</div>
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
					<Eyebrow>신입 채용 검토 중</Eyebrow>
				</div>
			</Reveal>

			{/* 거대 이름 + portrait */}
			<div className="grid grid-cols-12 gap-6 lg:gap-12 items-end">
				<div className="col-span-12 lg:col-span-8">
					<WordReveal
						className="font-general-semibold"
						style={{
							// 큰 글씨에서 lineHeight 0.88 은 한국어 자모가 윗줄 / 아랫줄 사이 겹쳐 보임.
							// 1.0 으로 늘려 여백 확보 (Bold 톤 유지하면서 가독성 우선).
							fontSize: 'clamp(2.6rem, 10.5vw, 11rem)',
							letterSpacing: '-0.04em',
							lineHeight: 1.0,
						}}
						items={[
							{ text: '안녕하세요,' },
							{ br: true },
							{ text: '개발자' },
							// noSep: '이석호' + '입니다.' 사이 공백 없이 자연스러운 한국어 결합.
							{ text: displayName, accent: true, noSep: true },
							{ text: '입니다.' },
						]}
					/>
				</div>
				<Reveal delay={0.16} className="col-span-12 lg:col-span-4">
					<div
						className="relative rounded-[18px] overflow-hidden"
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

			{/* 큰 tagline */}
			<Reveal
				as="p"
				delay={0.24}
				className="mt-12 lg:mt-16 max-w-3xl font-general-semibold"
				style={{
					fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)',
					lineHeight: 1.2,
					letterSpacing: '-0.02em',
				}}
			>
				{heroTagline}
			</Reveal>
		</section>
	);
}
