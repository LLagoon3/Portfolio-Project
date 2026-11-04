import ReactMarkdown from 'react-markdown';
import styles from './About.module.css';

const EXTERNAL_URL = /^https?:\/\//i;

// 외부(http/https) 링크는 새 탭 + 안전한 rel + 보조기기용 '(새 탭)' 안내. 그 밖의 링크는 그대로 둔다.
// react-markdown 의 기본 urlTransform 이 javascript: 같은 위험한 주소는 미리 비운다.
export function AboutMarkdownLink({ node, href = '', children, ...rest }) {
	if (!EXTERNAL_URL.test(href)) {
		return (
			<a href={href} {...rest}>
				{children}
			</a>
		);
	}
	return (
		<a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
			{children}
			<span className={styles.srOnly}> (새 탭)</span>
		</a>
	);
}

function heading(Tag) {
	function AboutMarkdownHeading({ node, ...rest }) {
		return <Tag {...rest} />;
	}
	return AboutMarkdownHeading;
}

// 소개 본문의 제목은 페이지 h1 / 섹션 h2 아래라 두 단계씩 낮춘다 (h1 → h3, h2 → h4 …, 최대 h6).
export const ABOUT_MARKDOWN_COMPONENTS = {
	a: AboutMarkdownLink,
	h1: heading('h3'),
	h2: heading('h4'),
	h3: heading('h5'),
	h4: heading('h6'),
	h5: heading('h6'),
	h6: heading('h6'),
};

export default function AboutMarkdown({ className = '', children }) {
	return (
		<div className={`${styles.markdown} ${className}`.trim()}>
			<ReactMarkdown components={ABOUT_MARKDOWN_COMPONENTS}>{children}</ReactMarkdown>
		</div>
	);
}
