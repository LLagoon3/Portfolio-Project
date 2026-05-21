import Link from 'next/link';
import Reveal from '../primitives/Reveal';
import Eyebrow from '../primitives/Eyebrow';

// 환경변수 미설정 시 fallback. 후속 PR 에서 about.contactEmail 필드 도입 시 SSR 로 교체.
const DEFAULT_EMAIL =
	process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hi@example.com';

export default function ContactCTA({ email }) {
	const target = email || DEFAULT_EMAIL;

	return (
		<section
			id="contact"
			className="py-24 lg:py-32 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal>
				<Eyebrow className="mb-6">— Let&apos;s talk</Eyebrow>
				<a
					href={`mailto:${target}`}
					className="bold-interactive block font-general-semibold hover:opacity-80 transition-opacity break-all"
					style={{
						fontSize: 'clamp(2.6rem, 9vw, 8rem)',
						letterSpacing: '-0.05em',
						lineHeight: 1,
						color: 'var(--paper)',
					}}
				>
					{target}
					<span style={{ color: 'var(--indigo-soft)' }}>.</span>
				</a>
			</Reveal>

			<Reveal delay={0.08} className="grid grid-cols-12 gap-6 mt-16 lg:mt-20">
				<div className="col-span-12 lg:col-span-8">
					<p className="leading-relaxed max-w-xl" style={{ color: 'var(--paper-dim)' }}>
						새로운 협업, 기술 컨설팅, 또는 그냥 커피 한 잔. 답장은 영업일 기준
						24시간 안에 드립니다.
					</p>
				</div>
				<div
					className="col-span-12 lg:col-span-4 flex flex-col gap-2 text-xs"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						color: 'var(--paper-faint)',
					}}
				>
					<div className="flex items-center justify-between">
						<span>EMAIL</span>
						<a
							href={`mailto:${target}`}
							className="bold-interactive transition-colors hover:text-[color:var(--paper)]"
							style={{ color: 'var(--paper-dim)' }}
						>
							{target}
						</a>
					</div>
					<div className="flex items-center justify-between">
						<span>CONTACT</span>
						<Link
							href="/contact"
							className="bold-interactive transition-colors hover:text-[color:var(--paper)]"
							style={{ color: 'var(--paper-dim)' }}
						>
							폼으로 보내기 ↗
						</Link>
					</div>
				</div>
			</Reveal>
		</section>
	);
}
