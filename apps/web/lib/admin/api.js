// 어드민 API 호출용 fetch 래퍼.
// - credentials: 'include' 로 admin_token 쿠키가 자동으로 붙음
// - JSON 요청/응답을 표준화
// - 401 일 때는 /admin/login 으로 튕겨주는 AuthError 를 던져 호출 측에서 일관 처리하도록
export class AdminApiError extends Error {
	constructor(message, { status, payload } = {}) {
		super(message);
		this.name = 'AdminApiError';
		this.status = status;
		this.payload = payload;
	}
}

export async function fetchAdmin(path, { method = 'GET', body, signal } = {}) {
	const init = {
		method,
		credentials: 'include',
		signal,
		headers: {},
	};
	if (body !== undefined) {
		init.body = JSON.stringify(body);
		init.headers['Content-Type'] = 'application/json';
	}

	const res = await fetch(path, init);

	let payload;
	const contentType = res.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) {
		payload = await res.json().catch(() => null);
	}

	if (res.status === 204) {
		return null;
	}
	if (!res.ok) {
		const message =
			payload?.error?.message ??
			payload?.message ??
			`request failed: ${res.status}`;
		throw new AdminApiError(message, { status: res.status, payload });
	}
	return payload?.data ?? payload ?? null;
}
