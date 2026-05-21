import Reveal from '../primitives/Reveal';
import Marquee from '../primitives/Marquee';

// 라군의 실제 스택 / 관심 영역. 영문 통일 (시안 톤 유지).
const KEYWORDS = [
	'Realtime Systems',
	'Performance Optimization',
	'Observability',
	'Operations Automation',
	'Redis & Caching',
	'MCP & AI Integration',
];

export default function KeywordMarquee() {
	return (
		<Reveal>
			<Marquee items={KEYWORDS} duration={36} />
		</Reveal>
	);
}
