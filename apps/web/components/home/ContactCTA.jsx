import Reveal from '../primitives/Reveal';
import Eyebrow from '../primitives/Eyebrow';

// 환경변수 미설정 시 fallback. 후속 PR 에서 about.contactEmail 필드 도입 시 SSR 로 교체.
const DEFAULT_EMAIL =
	process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'choonarm3@gmail.com';

const GITHUB_URL = 'https://github.com/LLagoon3';
const NOTION_URL =
	'https://dear-sawfish-e55.notion.site/15fd6568ef4b80509953d6e7648258dd?source=copy_link';

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
						백엔드 개발자로서 더 나은 서비스를 만드는 팀에 기여하고 싶습니다.
						언제든 편하게 연락 주세요.
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
						<span>GITHUB</span>
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="bold-interactive transition-colors hover:text-[color:var(--paper)]"
							style={{ color: 'var(--paper-dim)' }}
						>
							@LLagoon3
						</a>
					</div>
					<div className="flex items-center justify-between">
						<span>NOTION</span>
						<a
							href={NOTION_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="bold-interactive transition-colors hover:text-[color:var(--paper)]"
							style={{ color: 'var(--paper-dim)' }}
						>
							이력서 ↗
						</a>
					</div>
				</div>
			</Reveal>
		</section>
	);
}
