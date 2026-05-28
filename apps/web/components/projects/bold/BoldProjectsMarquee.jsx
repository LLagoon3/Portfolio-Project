import Marquee from '../../primitives/Marquee';

// 라군 stacks 톤 (career/profile.md 참조) — 백엔드 프레임워크 → 프론트엔드 → DB →
// 인프라/툴링 순. 후속에 백엔드 stacks 와 연동 검토.
const DEFAULT_KEYWORDS = [
	'FastAPI',
	'Django',
	'Next.js',
	'NestJS',
	'Express',
	'PostgreSQL',
	'MySQL',
	'Redis',
	'MongoDB',
	'Nginx',
	'Docker',
	'AWS',
	'CI/CD',
	'AI/LLM',
];

export default function BoldProjectsMarquee({ items = DEFAULT_KEYWORDS }) {
	return <Marquee items={items} duration={42} />;
}
