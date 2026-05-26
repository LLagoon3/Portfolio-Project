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
			{/* breadcrumb — 좁은 viewport 에서 단정하게 두 줄로 wrap. spacer 는 sm 이상만 */}
			<Reveal className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-10">
				<Link
					href="/projects"
					className="bold-interactive flex items-center gap-1.5 transition whitespace-nowrap"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						fontSize: '0.75rem',
						color: 'var(--paper-faint)',
					}}
				>
					<svg
						className="w-3 h-3 flex-shrink-0"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden="true"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					<span>모든 프로젝트</span>
				</Link>
				<span
					className="hidden sm:inline-block w-6 h-px"
					style={{ background: 'var(--line-strong)' }}
				/>
				<Eyebrow style={{ wordBreak: 'keep-all' }}>{eyebrow}</Eyebrow>
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

// title 안에서 accentWord 의 위치를 찾아 head / accent / tail 3-part 로 split.
// - accentWord 가 title 마지막 토큰: head / accent (2-line)
// - accentWord 가 title 첫 토큰: accent / tail (2-line)
// - accentWord 가 title 중간 토큰: head / accent / tail (3-line) — 시안 패턴
// - accentWord 가 title 에 없거나 미지정: 마지막 토큰을 accent 로 폴백 (안전)
function buildHeroItems(title, accentWord) {
	const trimmed = (title ?? '').trim();
	if (!trimmed) return [{ text: '' }];

	const tokens = trimmed.split(/\s+/);
	let accentIdx = tokens.length - 1;
	if (accentWord) {
		const idx = tokens.indexOf(accentWord);
		if (idx >= 0) accentIdx = idx;
	}

	const accent = tokens[accentIdx];
	const head = tokens.slice(0, accentIdx).join(' ');
	const tail = tokens.slice(accentIdx + 1).join(' ');

	const items = [];
	if (head) {
		items.push({ text: head }, { br: true });
	}
	items.push({ text: accent, accent: true });
	if (tail) {
		items.push({ br: true }, { text: tail });
	}
	return items;
}
