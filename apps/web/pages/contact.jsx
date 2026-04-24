import { motion } from 'framer-motion';
import ContactDetails from '../components/contact/ContactDetails';
import ContactForm from '../components/contact/ContactForm';
import PagesMetaHead from '../components/PagesMetaHead';

const API_BASE_URL =
	process.env.API_INTERNAL_URL || 'http://localhost:7341';

const EMPTY_CONTACT = { address: null, email: null, phone: null };

function Contact({ contact }) {
	return (
		<div>
			<PagesMetaHead title="Contact" />

			<motion.div
				initial={false}
				animate={{ opacity: 1 }}
				transition={{
					ease: 'easeInOut',
					duration: 0.5,
					delay: 0.1,
				}}
				className="container mx-auto flex flex-col-reverse lg:flex-row py-5 lg:py-10 lg:mt-5"
			>
				<ContactForm />

				<ContactDetails
					address={contact.address}
					email={contact.email}
					phone={contact.phone}
				/>
			</motion.div>
		</div>
	);
}

export async function getServerSideProps() {
	try {
		const res = await fetch(`${API_BASE_URL}/api/about`);
		if (res.status === 404) {
			// About 프로필이 세팅 전인 합법적 상태 — 연락처 섹션을 비워서 렌더
			return { props: { contact: EMPTY_CONTACT } };
		}
		if (!res.ok) {
			throw new Error(`[contact] About API returned ${res.status}`);
		}
		const body = await res.json();
		const data = body?.data;
		return {
			props: {
				contact: {
					address: data?.address ?? null,
					email: data?.email ?? null,
					phone: data?.phone ?? null,
				},
			},
		};
	} catch (err) {
		console.error('[contact] fetch failed', err);
		throw err;
	}
}

export default Contact;
