import { useState } from 'react';
import Button from '../reusable/Button';
import FormInput from '../reusable/FormInput';

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

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
						<span className="font-general-medium  px-7 py-4 text-white text-center font-medium tracking-wider bg-indigo-500 hover:bg-indigo-600 focus:ring-1 focus:ring-indigo-900 rounded-lg mt-6 duration-500">
							<Button
								title={
									status.state === 'loading'
										? 'Sending...'
										: 'Send Message'
								}
								type="submit"
								aria-label="Send Message"
								disabled={status.state === 'loading'}
							/>
						</span>
					</div>

					{status.state === 'success' && (
						<p
							className="mt-4 text-green-600 dark:text-green-400"
							role="status"
						>
							{status.message}
						</p>
					)}
					{status.state === 'error' && (
						<p
							className="mt-4 text-red-600 dark:text-red-400"
							role="alert"
						>
							{status.message}
						</p>
					)}
				</form>
			</div>
		</div>
	);
}

export default ContactForm;
