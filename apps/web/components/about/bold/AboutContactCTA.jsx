import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';
import PillButton from '../../primitives/PillButton';

const NOTION_RESUME_URL =
	'https://dear-sawfish-e55.notion.site/15fd6568ef4b80509953d6e7648258dd?source=copy_link';

export default function AboutContactCTA() {
	return (
		<section
			className="py-24 lg:py-32 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<div className="grid grid-cols-12 gap-6 items-end">
				<Reveal className="col-span-12 lg:col-span-8">
					<Eyebrow className="mb-6">— Let&apos;s talk</Eyebrow>
					<PillButton
						as="link"
						href="/contact"
						variant="ghost"
						className="block !rounded-none !border-0 !bg-transparent !p-0 hover:!translate-y-0"
						ariaLabel="Contact 페이지로 이동"
					>
						<span
							className="font-general-semibold hover:opacity-80 transition-opacity"
							style={{
								fontSize: 'clamp(2.4rem, 8vw, 7rem)',
								letterSpacing: '-0.05em',
								lineHeight: 1,
							}}
						>
							<span style={{ color: 'var(--indigo-soft)' }}>
								함께할{' '}
								<span
									style={{
										display: 'inline-block',
										fontStyle: 'italic',
										paddingRight: '0.1em',
									}}
								>
									기회를
								</span>
							</span>
							<br />
							기다립니다.
						</span>
					</PillButton>
				</Reveal>
				<Reveal
					delay={0.08}
					className="col-span-12 lg:col-span-4 lg:text-right flex flex-wrap gap-3 lg:justify-end"
				>
					<PillButton variant="cta" as="link" href="/contact" ariaLabel="Contact Me">
						<span>Contact Me</span>
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
					<PillButton
						variant="ghost"
						href={NOTION_RESUME_URL}
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
