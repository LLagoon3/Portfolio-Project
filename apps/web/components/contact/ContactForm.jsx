import { useState } from 'react';
import Button from '../reusable/Button';
import FormInput from '../reusable/FormInput';

// API 요청은 Next.js rewrites를 통해 같은 origin으로 프록시됨
const API_BASE_URL = '';

function ContactForm() {
	const [form, setForm] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [status, setStatus] = useState({ state: 'idle', message: '' });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus({ state: 'loading', message: '' });
		try {
			const res = await fetch(`${API_BASE_URL}/api/contact`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				const msg = Array.isArray(data?.message)
					? data.message.join(', ')
					: data?.message || '메시지 전송에 실패했습니다.';
				throw new Error(msg);
			}
			setStatus({
				state: 'success',
				message: '메시지가 성공적으로 전송되었습니다.',
			});
			setForm({ name: '', email: '', subject: '', message: '' });
		} catch (err) {
			setStatus({
				state: 'error',
				message: err.message || '메시지 전송에 실패했습니다.',
			});
		}
	};

	return (
		<div className="w-full lg:w-1/2">
			<div className="leading-loose">
				<form
					onSubmit={handleSubmit}
					className="max-w-xl m-4 p-6 sm:p-10 bg-secondary-light dark:bg-secondary-dark rounded-xl shadow-xl text-left"
				>
					<p className="font-general-medium text-primary-dark dark:text-primary-light text-2xl mb-8">
						Contact Form
					</p>

					<FormInput
						inputLabel="Full Name"
						labelFor="name"
						inputType="text"
						inputId="name"
						inputName="name"
						placeholderText="Your Name"
						ariaLabelName="Name"
						value={form.name}
						onChange={handleChange}
					/>
					<FormInput
						inputLabel="Email"
						labelFor="email"
						inputType="email"
						inputId="email"
						inputName="email"
						placeholderText="Your email"
						ariaLabelName="Email"
						value={form.email}
						onChange={handleChange}
					/>
					<FormInput
						inputLabel="Subject"
						labelFor="subject"
						inputType="text"
						inputId="subject"
						inputName="subject"
						placeholderText="Subject"
						ariaLabelName="Subject"
						value={form.subject}
						onChange={handleChange}
					/>

					<div className="mt-6">
						<label
							className="block text-lg text-primary-dark dark:text-primary-light mb-2"
							htmlFor="message"
						>
							Message
						</label>
						<textarea
							className="w-full px-5 py-2 border border-gray-300 dark:border-primary-dark border-opacity-50 text-primary-dark dark:text-secondary-light bg-ternary-light dark:bg-ternary-dark rounded-md shadow-sm text-md"
							id="message"
							name="message"
							cols="14"
							rows="6"
							aria-label="Message"
							value={form.message}
							onChange={handleChange}
							required
						></textarea>
					</div>

					<div className="mt-6">
						<Button
							title={status.state === 'loading' ? 'Sending...' : 'Send Message'}
							type="submit"
							size="lg"
							ariaLabel="Send Message"
							disabled={status.state === 'loading'}
							className="tracking-wider rounded-lg"
						/>
					</div>

					{status.state === 'success' && (
						<div
							role="status"
							aria-live="polite"
							className="mt-6 flex items-start gap-3 p-4 rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 animate-fade-in-up"
						>
							<svg
								className="w-6 h-6 flex-shrink-0 text-green-500 dark:text-green-400"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<div className="font-general-medium">
								<p className="text-green-800 dark:text-green-200 text-base">
									메시지가 성공적으로 전송되었습니다
								</p>
								<p className="text-green-700 dark:text-green-300/80 text-sm mt-0.5">
									빠른 시일 내에 답변드리겠습니다. 감사합니다!
								</p>
							</div>
						</div>
					)}
					{status.state === 'error' && (
						<div
							role="alert"
							aria-live="assertive"
							className="mt-6 flex items-start gap-3 p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 animate-fade-in-up"
						>
							<svg
								className="w-6 h-6 flex-shrink-0 text-red-500 dark:text-red-400"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
								/>
							</svg>
							<div className="font-general-medium">
								<p className="text-red-800 dark:text-red-200 text-base">
									전송에 실패했습니다
								</p>
								<p className="text-red-700 dark:text-red-300/80 text-sm mt-0.5">
									{status.message}
								</p>
							</div>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}

export default ContactForm;
