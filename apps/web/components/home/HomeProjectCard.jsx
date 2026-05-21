import Link from 'next/link';
import Image from 'next/image';

// 이미지 로드 전 placeholder — Bold 톤의 ink(#070E17) 4:5 단색 SVG dataURL.
// next/image 의 placeholder="blur" 가 자동 블러 + fade-in 처리. 외부 URL/uploads 라
// blurDataURL 자동 생성이 안 되므로 명시.
const INK_BLUR =
	'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDUiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjUiIGZpbGw9IiMwNzBFMTciLz48L3N2Zz4=';

// 4:5 카드 — 번호 / 카테고리 / 호버 화살표 회전.
// img src 는 /uploads/... 형태일 수 있고, 외부 URL 일 수도 있음.
// next.config.js rewrites 가 /uploads/* 를 API 로 프록시.
export default function HomeProjectCard({ index, project }) {
	const { url, img, title, category } = project;
	const num = String(index + 1).padStart(3, '0');

	return (
		<Link
			href="/projects/[url]"
			as={`/projects/${url}`}
			aria-label={title}
			className="bold-interactive group relative block overflow-hidden rounded-[18px] transition-all duration-500"
			style={{
				background: 'rgba(255, 255, 255, 0.02)',
				border: '1px solid var(--line)',
			}}
		>
			{/* 번호 badge */}
			<span
				className="absolute top-[14px] left-[16px] z-[2] px-[9px] py-[4px] rounded-[6px] text-[10px]"
				style={{
					fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
					letterSpacing: '0.12em',
					color: 'rgba(255, 255, 255, 0.85)',
					background: 'rgba(0, 0, 0, 0.45)',
					backdropFilter: 'blur(8px)',
				}}
			>
				{num}
			</span>
			{/* 카테고리 badge */}
			{category && (
				<span
					className="absolute top-[14px] right-[16px] z-[2] px-[9px] py-[4px] rounded-[6px] font-general-medium text-[11px] uppercase"
					style={{
						letterSpacing: '0.12em',
						color: 'rgba(255, 255, 255, 0.85)',
						background: 'rgba(0, 0, 0, 0.45)',
						backdropFilter: 'blur(8px)',
					}}
				>
					{category}
				</span>
			)}

			{/* 4:5 이미지 영역 */}
			<div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
				{img ? (
					<Image
						src={img}
						alt={title}
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						style={{ objectFit: 'cover' }}
						placeholder="blur"
						blurDataURL={INK_BLUR}
						className="transition-transform duration-1000 group-hover:scale-[1.06]"
					/>
				) : (
					<div
						className="w-full h-full"
						style={{ background: 'rgba(255,255,255,0.04)' }}
						aria-hidden="true"
					/>
				)}
				{/* 하단 어둠 veil */}
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						background:
							'linear-gradient(0deg, rgba(7,14,23,0.78) 0%, rgba(7,14,23,0.2) 45%, rgba(7,14,23,0) 70%)',
					}}
					aria-hidden="true"
				/>
			</div>

			{/* 하단 body */}
			<div className="absolute left-[18px] right-[18px] bottom-[18px] z-[2] flex items-end justify-between gap-[10px]">
				<div className="font-general-semibold text-white" style={{
					fontSize: 'clamp(1.15rem, 1.6vw, 1.55rem)',
					letterSpacing: '-0.02em',
					lineHeight: 1.1,
				}}>
					{title}
				</div>
				<span
					className="w-9 h-9 sm:w-9 sm:h-9 flex-shrink-0 rounded-full grid place-items-center transition-all duration-500 text-white"
					style={{ border: '1px solid rgba(255,255,255,0.35)' }}
					aria-hidden="true"
				>
					<svg
						className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[-45deg] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</span>
			</div>
		</Link>
	);
}
