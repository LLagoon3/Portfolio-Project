import ReactMarkdown from 'react-markdown';
import styles from './ProjectDetail.module.css';

const EXTERNAL_URL = /^https?:\/\//i;

// 외부(http/https) 링크는 새 탭 + 안전한 rel + 보조기기용 '(새 탭)' 안내. 그 밖의 링크는 그대로 둔다.
// react-markdown 의 기본 urlTransform 이 javascript: 같은 위험한 주소는 미리 비운다.
export function MarkdownLink({ node, href = '', children, ...rest }) {
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

// 과정 본문 안의 제목은 섹션(h2) / 단계(h3) 아래 단계라 모두 h4 로 낮춘다.
function MarkdownHeading({ node, ...rest }) {
	return <h4 {...rest} />;
}

const COMPONENTS = {
	a: MarkdownLink,
	h1: MarkdownHeading,
	h2: MarkdownHeading,
	h3: MarkdownHeading,
	h4: MarkdownHeading,
	h5: MarkdownHeading,
	h6: MarkdownHeading,
};

export default function ProjectDetailMarkdown({ children }) {
	return (
		<div className={styles.prose}>
			<ReactMarkdown components={COMPONENTS}>{children}</ReactMarkdown>
		</div>
	);
}
