import ReactMarkdown from 'react-markdown';
import styles from './Contact.module.css';

const EXTERNAL_URL = /^https?:\/\//i;

// 외부(http/https) 링크는 새 탭 + 안전한 rel + 보조기기용 '(새 탭)' 안내. 그 밖의 링크는 그대로 둔다.
// react-markdown 의 기본 urlTransform 이 javascript: 같은 위험한 주소는 미리 비운다.
export function ContactMarkdownLink({ node, href = '', children, ...rest }) {
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
	function ContactMarkdownHeading({ node, ...rest }) {
		return <Tag {...rest} />;
	}
	return ContactMarkdownHeading;
}

// FAQ 답변은 페이지 h1 / 섹션 h2 / 질문 h3 아래라 제목을 세 단계씩 낮춘다 (h1 → h4, h2 → h5, 그 밖 → h6).
export const CONTACT_MARKDOWN_COMPONENTS = {
	a: ContactMarkdownLink,
	h1: heading('h4'),
	h2: heading('h5'),
	h3: heading('h6'),
	h4: heading('h6'),
	h5: heading('h6'),
	h6: heading('h6'),
};

export default function ContactMarkdown({ children }) {
	return (
		<div className={styles.markdown}>
			<ReactMarkdown components={CONTACT_MARKDOWN_COMPONENTS}>{children}</ReactMarkdown>
		</div>
	);
}
