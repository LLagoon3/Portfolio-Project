// 좌측 host-라벨 + 우측 링크 한 줄. BoldContactSidebar (Direct 섹션) 와
// BoldProjectDetailHero (Links 섹션) 두 곳에 거의 동일한 구현이 복사돼 있던
// 것을 단일 primitive 로 통합.
export default function DirectLinkRow({
	label,
	href,
	external = true,
	children,
}) {
	return (
		<div className="flex items-center justify-between gap-3">
			<span>{label}</span>
			<a
				href={href}
				target={external ? '_blank' : undefined}
				rel={external ? 'noopener noreferrer' : undefined}
				className="bold-interactive transition-colors hover:text-[color:var(--paper)] truncate"
				style={{ color: 'var(--paper-dim)' }}
			>
				{children}
			</a>
		</div>
	);
}

// URL host 에서 root 도메인 추출 → 대문자 10자 cap. 예: github.com → GITHUB.
// 파싱 실패 시 'LINK' 폴백.
export function deriveLinkLabel(url) {
	try {
		const host = new URL(url).host.toLowerCase();
		const parts = host.split('.');
		const root = parts.length >= 2 ? parts[parts.length - 2] : host;
		return root.toUpperCase().slice(0, 10);
	} catch {
		return 'LINK';
	}
}
