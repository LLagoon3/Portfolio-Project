import { useRouter } from 'next/router';
import { useState } from 'react';
import PagesMetaHead from '../../components/PagesMetaHead';
import Button from '../../components/reusable/Button';
import FormInput from '../../components/reusable/FormInput';

function AdminLogin() {
	const router = useRouter();
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		if (submitting) return;
		setSubmitting(true);
		setError('');
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ password }),
			});
			if (res.status === 401) {
				setError('비밀번호가 올바르지 않습니다.');
				return;
			}
			if (!res.ok) {
				setError('서버 오류로 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
				return;
			}
			const next = typeof router.query.next === 'string' ? router.query.next : '/admin';
			router.replace(next);
		} catch (err) {
			console.error('[admin login] request failed', err);
			setError('네트워크 오류로 로그인에 실패했습니다.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-primary-light dark:bg-primary-dark px-4">
			<PagesMetaHead title="Admin Login" />
			<div className="w-full max-w-sm bg-secondary-light dark:bg-secondary-dark rounded-xl shadow-lg p-8">
				<h1 className="font-general-medium text-2xl text-primary-dark dark:text-primary-light mb-2">
					어드민 로그인
				</h1>
				<p className="font-general-regular text-sm text-ternary-dark dark:text-ternary-light mb-6">
					포트폴리오 관리 페이지에 접근하려면 비밀번호를 입력해주세요.
				</p>
				<form onSubmit={handleSubmit}>
					<FormInput
						inputLabel="비밀번호"
						labelFor="admin-password"
						inputType="password"
						inputId="admin-password"
						inputName="password"
						placeholderText="••••••••"
						ariaLabelName="Admin password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error && (
						<p
							className="font-general-regular text-sm text-red-500 dark:text-red-400 mb-3"
							role="alert"
						>
							{error}
						</p>
					)}
					<Button
						title={submitting ? '확인 중…' : '로그인'}
						type="submit"
						variant="primary"
						disabled={submitting}
						className="w-full mt-2"
						ariaLabel="Sign in"
					/>
				</form>
			</div>
		</div>
	);
}

export default AdminLogin;
