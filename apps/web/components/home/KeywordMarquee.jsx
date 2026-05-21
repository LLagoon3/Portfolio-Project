import Reveal from '../primitives/Reveal';
import Marquee from '../primitives/Marquee';

// 고정 키워드 + 프로젝트 카테고리 unique 를 mix.
const BASE_KEYWORDS = [
	'Backend Architecture',
	'Realtime Systems',
	'Distributed Data',
	'Developer Experience',
	'API Design',
	'Observability',
];

export default function KeywordMarquee({ projects = [] }) {
	const categorySet = Array.from(
		new Set(projects.map((p) => p.category).filter(Boolean))
	);
	const items = [...BASE_KEYWORDS, ...categorySet];

	return (
		<Reveal>
			<Marquee items={items} duration={36} />
		</Reveal>
	);
}
