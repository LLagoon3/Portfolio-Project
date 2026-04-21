const API_BASE_URL =
	process.env.API_INTERNAL_URL || 'http://localhost:7341';

// getServerSideProps 래퍼: 요청 쿠키를 /api/auth/me 로 전달해 인증을 확인한다.
// - 인증 성공: innerHandler 의 결과에 props 만 허용 (인증된 상태의 페이지 데이터)
// - 401: /admin/login 으로 서버 리다이렉트
// - 5xx / 네트워크 오류: 공개 페이지 정책과 동일하게 throw 로 드러냄 (404 graceful 대상 아님)
export function requireAuth(innerHandler) {
	return async function wrapped(ctx) {
		const cookieHeader = ctx.req?.headers?.cookie ?? '';
		try {
			const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
				headers: cookieHeader ? { cookie: cookieHeader } : undefined,
			});

			if (res.status === 401) {
				return {
					redirect: { destination: '/admin/login', permanent: false },
				};
			}
			if (!res.ok) {
				throw new Error(`[admin requireAuth] /api/auth/me returned ${res.status}`);
			}

			if (typeof innerHandler === 'function') {
				return innerHandler(ctx);
			}
			return { props: {} };
		} catch (err) {
			console.error('[admin requireAuth] failed', err);
			throw err;
		}
	};
}
