// /projects/[url] 상세 화면 전용 순수 헬퍼. API 응답을 화면에 필요한 모양으로 바꾸는 규칙만 둔다.
import { parseYear } from './projects';
import { sortProjectsForIndex } from './projectsIndex';

// 같은 카테고리 프로젝트는 기존 상세 화면과 같이 최대 4개까지 보여 준다.
export const RELATED_LIMIT = 4;

// admin 폼의 기술 그룹 기본 제목. 그룹이 하나뿐이면 '기술' 제목과 같은 말이라 숨긴다.
const GENERIC_STACK_TITLES = ['tools & technologies'];

export const RELATION_LABELS = {
	related: '같은 카테고리',
	previous: '이전 프로젝트',
	next: '다음 프로젝트',
};

function text(value) {
	return typeof value === 'string' ? value.trim() : '';
}

// 1 entry = 1 step. body 가 빈 row 는 건너뛰고, kind/title 이 빈 row 는 '메모' 로 표시한다.
export function parseProcessSteps(projectDetails) {
	if (!Array.isArray(projectDetails)) return [];
	return projectDetails
		.map((entry, index) => {
			const body = text(entry?.details);
			if (!body) return null;
			return {
				key: entry.id ?? `step-${index}`,
				kind: text(entry.kind) || null,
				title: text(entry.title) || '메모',
				body,
			};
		})
		.filter(Boolean);
}

// 첫 이미지는 표지, 나머지는 화면 갤러리. 이미지 제목이 프로젝트 제목과 같으면 캡션을 생략하고
// 보조기기 이름은 '<제목> 화면 n' 으로 붙인다.
export function buildGallery(project) {
	const images = Array.isArray(project?.ProjectImages) ? project.ProjectImages : [];
	const projectTitle = text(project?.title);
	return images
		.slice(1)
		.filter((image) => text(image?.img))
		.map((image, index) => {
			const title = text(image.title);
			const caption = title && title !== projectTitle ? title : '';
			return {
				key: image.id ?? `image-${index}`,
				src: image.img,
				caption,
				name: caption || `${projectTitle} 화면 ${index + 1}`,
			};
		});
}

export function pickCoverImage(project) {
	const cover = Array.isArray(project?.ProjectImages) ? project.ProjectImages[0] : null;
	return text(cover?.img) ? cover.img : '';
}

export function buildStackGroups(technologies) {
	if (!Array.isArray(technologies)) return [];
	const groups = technologies
		.map((group, index) => ({
			key: group?.id ?? `${text(group?.title)}-${index}`,
			title: text(group?.title),
			techs: (Array.isArray(group?.techs) ? group.techs : []).map(text).filter(Boolean),
		}))
		.filter((group) => group.techs.length > 0);
	const hideSingleGenericTitle =
		groups.length === 1 && GENERIC_STACK_TITLES.includes(groups[0].title.toLowerCase());
	return groups.map((group) => ({
		...group,
		title: hideSingleGenericTitle ? '' : group.title,
	}));
}

// 값/라벨/보조 설명은 API 문자열을 그대로 쓴다. 값과 라벨이 모두 빈 항목만 건너뛴다.
export function buildImpact(impact) {
	if (!Array.isArray(impact)) return [];
	return impact
		.map((stat, index) => ({
			key: stat?.id ?? `stat-${index}`,
			value: text(stat?.value),
			label: text(stat?.label),
			sub: text(stat?.sub),
		}))
		.filter((stat) => stat.value || stat.label);
}

export function buildLinks(links) {
	if (!Array.isArray(links)) return [];
	return links
		.map((link, index) => ({
			key: link?.id ?? `link-${index}`,
			url: text(link?.url),
			label: text(link?.label) || text(link?.url),
		}))
		.filter((link) => link.url);
}

export function pickQuote(quote) {
	const quoteText = text(quote?.text);
	if (!quoteText) return null;
	return { text: quoteText, author: text(quote?.author) };
}

function toMoreRow(relation, project) {
	return {
		relation,
		url: project.url,
		title: project.title ?? '',
		category: project.category ?? '',
		year: parseYear(project.headerPublishDate),
	};
}

// 다른 프로젝트: 같은 카테고리(API 순서, 최대 RELATED_LIMIT) 다음에 목록 기본 순서(최신순)의
// 바로 앞/뒤 프로젝트를 붙인다. 이미 같은 카테고리로 나온 프로젝트는 반복하지 않는다.
// sortProjectsForIndex 는 실행 환경 로케일을 따르므로 서버(getServerSideProps)에서만 호출한다.
export function buildMoreProjects(project, projects) {
	if (!project?.url || !Array.isArray(projects)) return [];
	const candidates = projects.filter((p) => p?.url && p.title);
	const related = project.category
		? candidates
				.filter((p) => p.url !== project.url && p.category === project.category)
				.slice(0, RELATED_LIMIT)
		: [];
	const rows = related.map((p) => toMoreRow('related', p));
	const seen = new Set(related.map((p) => p.url));

	const ordered = sortProjectsForIndex(candidates);
	const index = ordered.findIndex((p) => p.url === project.url);
	if (index >= 0) {
		[
			['previous', ordered[index - 1]],
			['next', ordered[index + 1]],
		].forEach(([relation, neighbour]) => {
			if (!neighbour || seen.has(neighbour.url)) return;
			seen.add(neighbour.url);
			rows.push(toMoreRow(relation, neighbour));
		});
	}
	return rows;
}
