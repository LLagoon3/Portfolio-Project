import Reveal from '../../primitives/Reveal';
import Eyebrow from '../../primitives/Eyebrow';

// 라군 profile.md / projects.md 기반. 후속 PR 에서 /api/about.journey[] 도입.
const JOURNEY = [
	{
		year: '2026.01 — Now',
		title: '통합 로그 시스템',
		role: '백엔드 · 외주',
		body: '여러 보안 솔루션 로그를 공통 스키마로 정규화하고 syslog-ng / Vector / Loki / Grafana / Teams 알림 / MCP 자연어 조회를 연결한 통합 파이프라인 구성. NestJS MCP 서버 직접 구현.',
	},
	{
		year: '2025.08 — 2025.10',
		title: '클래스업 학생앱 — 타이머 서비스',
		role: '백엔드 · Express / MongoDB',
		body: 'Joi 검증·전역 에러 처리·응답 형식 통일. MongoDB 복합 인덱싱으로 쿼리 77% 단축, 키셋 페이지네이션 30% 단축. WebSocket 기반 실시간 사용자 리스트.',
	},
	{
		year: '2025',
		title: '베팅덕 — 실시간 베팅 서비스',
		role: '백엔드 · Redis 큐 / 비동기',
		body: '베팅 종료 API 의 병목을 분석하고 Redis 기반 큐와 비동기 처리를 적용해 응답 시간을 1441ms → 333ms 로 단축.',
	},
	{
		year: '2024',
		title: 'CaTs 챗봇 · 커스텀 웹 프레임워크',
		role: '백엔드 · 원리 학습',
		body: 'RAG 기반 챗봇과 Node.js net 모듈 위 HTTP 파싱 / Router / Middleware 직접 구현. 라이브러리 한 줄 위의 동작 원리를 이해하기 위한 학습 프로젝트.',
	},
	{
		year: '2019.03 — 2025.02',
		title: '충북대학교 컴퓨터공학과',
		role: '학사 · 3.76 / 4.5',
		body: 'RLHF / TRLX 기반 학부연구 + 다수 팀 프로젝트 · 인턴 · 외주를 통해 백엔드 / 데이터 / AI 접점 경험.',
	},
];

export default function AboutJourney() {
	return (
		<section
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="flex items-end justify-between mb-10 lg:mb-14">
				<div>
					<Eyebrow className="mb-3">— Journey</Eyebrow>
					<h2
						className="font-general-semibold"
						style={{
							fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
							letterSpacing: '-0.04em',
							lineHeight: 0.88,
						}}
					>
						지나온 길
						<span style={{ color: 'var(--indigo-soft)' }}>.</span>
					</h2>
				</div>
				<div
					className="hidden md:block text-xs"
					style={{
						fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
						color: 'var(--paper-faint)',
					}}
				>
					2019 → 2026
				</div>
			</Reveal>

			<div>
				{JOURNEY.map((row, idx) => (
					<Reveal
						key={row.year + row.title}
						delay={idx * 0.06}
						className="bold-tl-row py-[1.8rem] border-t"
						style={{ borderColor: 'var(--line)' }}
					>
						<div
							className="text-xs"
							style={{
								fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
								letterSpacing: '0.1em',
								color: 'var(--indigo-soft)',
								paddingTop: '0.4rem',
							}}
						>
							{row.year}
						</div>
						<div>
							<div
								className="font-general-semibold mb-[0.35rem]"
								style={{
									fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)',
									letterSpacing: '-0.02em',
								}}
							>
								{row.title}
							</div>
							<div
								className="font-general-medium text-[13px] mb-3"
								style={{ color: 'var(--paper-dim)' }}
							>
								{row.role}
							</div>
							<div
								className="leading-relaxed"
								style={{ color: 'var(--paper-dim)', maxWidth: '60ch' }}
							>
								{row.body}
							</div>
						</div>
					</Reveal>
				))}
				{/* 마지막 row 아래 보더 */}
				<div style={{ borderBottom: '1px solid var(--line)' }} />
			</div>
		</section>
	);
}
