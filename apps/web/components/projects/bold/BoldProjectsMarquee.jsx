import Marquee from '../../primitives/Marquee';

// 라군 stacks 톤 (career/profile.md 참조) — 후속에 백엔드 stacks 와 연동 검토.
const DEFAULT_KEYWORDS = [
	'FastAPI',
	'Next.js',
	'NestJS',
	'PostgreSQL',
	'Docker',
	'AWS',
	'CI/CD',
	'AI · LLM',
	'실험 · 개선',
];

export default function BoldProjectsMarquee({ items = DEFAULT_KEYWORDS }) {
	return <Marquee items={items} duration={42} />;
}
