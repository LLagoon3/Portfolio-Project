import ReactMarkdown from 'react-markdown';
import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';

// bio[] 의 각 단락을 ReactMarkdown 으로 단락 보존 렌더.
// Home 의 stripMarkdownHeaders 와 다른 처리 — About 은 마크다운 헤더 / 강조 / 리스트
// 모두 시각화 필요.
export default function AboutBioSection({ bio = [] }) {
	return (
		<section
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<div className="grid grid-cols-12 gap-6 lg:gap-12">
				<Reveal className="col-span-12 lg:col-span-4">
					<div className="lg:sticky lg:top-28">
						<Eyebrow className="mb-3">— Bio</Eyebrow>
						<h2
							className="font-general-semibold"
							style={{
								fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
								letterSpacing: '-0.04em',
								lineHeight: 1.15,
							}}
						>
							기능 구현을 넘어
							<br />
							서비스의{' '}
							<span
								style={{
									display: 'inline-block',
									color: 'var(--indigo-soft)',
									fontStyle: 'italic',
									paddingRight: '0.1em',
								}}
							>
								안정성
							</span>
							과
							<br />
							<span
								style={{
									display: 'inline-block',
									color: 'var(--indigo-soft)',
									fontStyle: 'italic',
									paddingRight: '0.1em',
								}}
							>
								유지보수성
							</span>
							을
							<br />
							고민합니다.
						</h2>
					</div>
				</Reveal>
				<Reveal delay={0.08} className="col-span-12 lg:col-span-8">
					<div className="bold-prose">
						{bio.length === 0 ? (
							<p style={{ color: 'var(--paper-dim)' }}>
								자기소개가 아직 등록되지 않았습니다.
							</p>
						) : (
							bio.map((paragraph, idx) => (
								<ReactMarkdown key={idx}>{paragraph}</ReactMarkdown>
							))
						)}
					</div>
				</Reveal>
			</div>
		</section>
	);
}
