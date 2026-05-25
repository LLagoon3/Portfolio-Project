import Image from 'next/image';
import Link from 'next/link';
import Reveal from '../../../primitives/Reveal';
import WordReveal from '../../../primitives/WordReveal';
import Eyebrow from '../../../primitives/Eyebrow';

export default function BoldProjectDetailHero({
	title,
	accentWord,
	subtitle,
	eyebrow,
	coverImage,
	meta = [],
}) {
	// 마지막 단어를 accent 로 분리 (이미 accentWord 가 prop 으로 주어지면 그걸 사용).
	const items = buildHeroItems(title, accentWord);

	return (
		<section id="hero" className="pt-28 lg:pt-40 pb-16 lg:pb-20">
			{/* breadcrumb */}
			<Reveal className="flex items-center gap-3 mb-10">
				<Link
					href="/projects"
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
					모든 프로젝트
				</Link>
				<span className="w-6 h-px" style={{ background: 'var(--line-strong)' }} />
				<Eyebrow>{eyebrow}</Eyebrow>
			</Reveal>

			{/* 거대 타이틀 + 우측 cover */}
			<div className="grid grid-cols-12 gap-6 lg:gap-12 items-center">
				<div className="col-span-12 lg:col-span-8">
					<WordReveal
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(2rem, calc((100vw - 3rem) / 8), 5rem)',
							letterSpacing: '-0.04em',
							lineHeight: 1.1,
							wordBreak: 'keep-all',
						}}
						items={items}
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
						{coverImage ? (
							<Image
								src={coverImage}
								alt={title}
								fill
								sizes="(min-width: 1024px) 33vw, 80vw"
								style={{ objectFit: 'cover' }}
								priority
							/>
						) : null}
						<div
							className="absolute inset-0 pointer-events-none"
							style={{
								background:
									'linear-gradient(180deg, transparent 60%, rgba(7,14,23,0.5))',
							}}
							aria-hidden="true"
						/>
					</div>
				</Reveal>
			</div>

			{/* Hero subtitle — admin 명시 입력 시에만 노출. WordReveal 직후, meta strip 위. */}
			{subtitle && (
				<Reveal
					delay={0.2}
					as="p"
					className="mt-10 lg:mt-12 max-w-3xl font-general-semibold"
					style={{
						fontSize: 'clamp(1.2rem, 1.6vw, 1.6rem)',
						lineHeight: 1.4,
						letterSpacing: '-0.02em',
						color: 'var(--paper-dim)',
						wordBreak: 'keep-all',
					}}
				>
					{subtitle}
				</Reveal>
			)}

			{/* meta strip — 4-col (Client / Role / Timeline / Category). 미존재 행 hide */}
			{meta.length > 0 && (
				<Reveal
					delay={0.24}
					className="mt-14 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 pt-8 lg:pt-10 border-t"
					style={{ borderColor: 'var(--line-strong)' }}
				>
					{meta.map((m) => (
						<div key={m.label}>
							<Eyebrow className="mb-2">{m.label}</Eyebrow>
							<div
								className="font-general-semibold"
								style={{
									fontSize: 'clamp(1.05rem, 1.4vw, 1.4rem)',
									letterSpacing: '-0.02em',
									lineHeight: 1.25,
									wordBreak: 'keep-all',
								}}
							>
								{m.value}
							</div>
						</div>
					))}
				</Reveal>
			)}
		</section>
	);
}

function buildHeroItems(title, accentWord) {
	const trimmed = (title ?? '').trim();
	if (!trimmed) return [{ text: '' }];

	// accentWord 가 지정되면 끝부분과 일치 여부 확인 후 분리. 아니면 마지막 공백 토큰 사용.
	const tokens = trimmed.split(/\s+/);
	const accent = accentWord || tokens[tokens.length - 1];
	const head = tokens.slice(0, -1).join(' ');

	if (!head) {
		return [{ text: accent, accent: true }];
	}
	return [
		{ text: head },
		{ br: true },
		{ text: accent, accent: true },
	];
}
