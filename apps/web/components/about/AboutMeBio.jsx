import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

function AboutMeBio({ name, tagline, profileImage, bio = [] }) {
	return (
		<div className="block sm:flex sm:gap-10 mt-10 sm:mt-20">
			<div className="w-full sm:w-1/4 mb-7 sm:mb-0">
				<Image
					src={profileImage}
					width={200}
					height={200}
					className="rounded-lg"
					alt={name ? `${name} profile` : 'Profile Image'}
				/>
			</div>

			<div className="font-general-regular w-full sm:w-3/4 text-left">
				{name && (
					<p className="text-2xl sm:text-3xl font-semibold text-primary-dark dark:text-primary-light mb-1">
						{name}
					</p>
				)}
				{tagline && (
					<p className="text-md sm:text-lg text-ternary-dark dark:text-ternary-light mb-4">
						{tagline}
					</p>
				)}
				{bio.map((paragraph, idx) => (
					<div
						key={idx}
						className="prose dark:prose-invert max-w-none mb-4 text-ternary-dark dark:text-ternary-light prose-strong:text-primary-dark dark:prose-strong:text-primary-light prose-p:text-lg"
					>
						<ReactMarkdown>{paragraph}</ReactMarkdown>
					</div>
				))}
			</div>
		</div>
	);
}

export default AboutMeBio;
