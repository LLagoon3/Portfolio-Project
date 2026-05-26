import BoldLayout from '../components/layout/bold/BoldLayout';
import PagesMetaHead from '../components/PagesMetaHead';
import BoldContactHero from '../components/contact/bold/BoldContactHero';
import BoldContactBigEmail from '../components/contact/bold/BoldContactBigEmail';
import BoldContactForm from '../components/contact/bold/BoldContactForm';
import BoldContactSidebar from '../components/contact/bold/BoldContactSidebar';
import BoldContactFaq from '../components/contact/bold/BoldContactFaq';

const API_BASE_URL =
	process.env.API_INTERNAL_URL || 'http://localhost:7341';

const EMPTY_CONTACT = {
	address: null,
	email: null,
	availability: null,
	socials: [],
	faqs: [],
};

function Contact({ contact }) {
	return (
		<>
			<PagesMetaHead title="Contact" />

			<div className="container mx-auto px-6 lg:px-10">
				<BoldContactHero />
				<BoldContactBigEmail email={contact.email} />

				<section
					className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 py-16 lg:py-20 border-t border-b"
					style={{ borderColor: 'var(--line)' }}
				>
					<div className="lg:col-span-7">
						<BoldContactForm />
					</div>
					<div className="lg:col-span-5">
						<BoldContactSidebar
							email={contact.email}
							address={contact.address}
							availability={contact.availability}
							socials={contact.socials}
						/>
					</div>
				</section>

				<BoldContactFaq faqs={contact.faqs} />
			</div>
		</>
	);
}

Contact.getLayout = (page) => <BoldLayout>{page}</BoldLayout>;

export async function getServerSideProps() {
	try {
		const res = await fetch(`${API_BASE_URL}/api/about`);
		if (res.status === 404) {
			// About 프로필이 아직 세팅되지 않은 합법적 상태 — 연락처 섹션을 비워서 렌더
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
					availability: data?.availability ?? null,
					socials: data?.socials ?? [],
					faqs: data?.faqs ?? [],
				},
			},
		};
	} catch (err) {
		console.error('[contact] fetch failed', err);
		throw err;
	}
}

export default Contact;
