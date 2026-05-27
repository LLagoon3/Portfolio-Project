import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';
import DirectLinkRow, { deriveLinkLabel } from '../../primitives/DirectLinkRow';

// socials 는 admin About 입력으로 동적. EMAIL 행은 about.email 우선. 빈 배열이면 EMAIL 만 노출.
export default function BoldContactSidebar({
	email,
	address,
	availability,
	socials = [],
}) {
	const statusLabel = availability;

	return (
		<aside className="flex flex-col gap-6">
			{/* Availability 카드 */}
			{statusLabel && (
				<Reveal>
					<div
						className="rounded-[18px] p-6"
						style={{
							background:
								'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.05))',
							border: '1px solid var(--line-strong)',
						}}
					>
						<div className="flex items-center gap-2 mb-2">
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
							<Eyebrow>Availability</Eyebrow>
						</div>
						<div
							className="font-general-semibold"
							style={{
								fontSize: 'clamp(1.2rem, 1.6vw, 1.6rem)',
								letterSpacing: '-0.02em',
							}}
						>
							{statusLabel}
						</div>
					</div>
				</Reveal>
			)}

			{/* Direct 링크 */}
			<Reveal delay={0.08}>
				<Eyebrow className="mb-4">— Direct</Eyebrow>
				<div
					className="flex flex-col gap-2 text-xs"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						color: 'var(--paper-faint)',
					}}
				>
					{email && (
						<DirectLinkRow label="EMAIL" href={`mailto:${email}`} external={false}>
							{email}
						</DirectLinkRow>
					)}
					{socials.map((s) => (
						<DirectLinkRow
							key={`${s.label}-${s.url}`}
							label={deriveLinkLabel(s.url)}
							href={s.url}
						>
							{s.label}
						</DirectLinkRow>
					))}
				</div>
			</Reveal>

			{/* Location */}
			<Reveal delay={0.16}>
				<Eyebrow className="mb-4">— Location</Eyebrow>
				<div
					className="text-sm leading-relaxed"
					style={{ color: 'var(--paper-dim)' }}
				>
					{address || 'Seoul · KST'}
				</div>
			</Reveal>
		</aside>
	);
}

