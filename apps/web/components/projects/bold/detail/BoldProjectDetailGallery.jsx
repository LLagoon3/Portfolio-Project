import Image from 'next/image';
import Reveal from '../../../primitives/Reveal';
import Eyebrow from '../../../primitives/Eyebrow';

export default function BoldProjectDetailGallery({ images = [] }) {
	if (!images.length) return null;

	// 모자이크: 1 big (col-span-7) + 2 stacked (col-span-5). 4번째 이상은 horizontal scroll.
	const big = images[0];
	const stacked = images.slice(1, 3);
	const extras = images.slice(3);

	return (
		<section
			id="gallery"
			className="py-20 lg:py-24 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			<Reveal className="mb-10">
				<Eyebrow className="mb-3">— Gallery</Eyebrow>
				<h2
					className="font-general-semibold"
					style={{
						fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
						letterSpacing: '-0.04em',
						lineHeight: 1.15,
					}}
				>
					화면으로 보기
					<span style={{ color: 'var(--indigo-soft)' }}>.</span>
				</h2>
			</Reveal>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
				<Reveal className="lg:col-span-7">
					<GalleryTile image={big} aspect="4 / 3" />
				</Reveal>
				{stacked.length > 0 && (
					<div className="lg:col-span-5 grid grid-cols-1 gap-4 lg:gap-6">
						{stacked.map((img, idx) => (
							<Reveal key={img.id ?? idx} delay={0.08 + idx * 0.06}>
								<GalleryTile image={img} aspect="4 / 3" />
							</Reveal>
						))}
					</div>
				)}
			</div>

			{extras.length > 0 && (
				<Reveal delay={0.16} className="mt-8 lg:mt-12">
					<Eyebrow className="mb-4">— 추가 스크린</Eyebrow>
					<div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
						{extras.map((img) => (
							<div
								key={img.id}
								className="flex-shrink-0 w-[280px] sm:w-[360px] lg:w-[420px] snap-start"
							>
								<GalleryTile image={img} aspect="4 / 3" />
							</div>
						))}
					</div>
				</Reveal>
			)}
		</section>
	);
}

function GalleryTile({ image, aspect }) {
	return (
		<div
			className="relative overflow-hidden rounded-[14px] w-full"
			style={{
				border: '1px solid var(--line-strong)',
				aspectRatio: aspect,
				background:
					'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(99,102,241,0.04))',
			}}
		>
			{image?.img && (
				<Image
					src={image.img}
					alt={image.title || ''}
					fill
					sizes="(min-width: 1024px) 50vw, 90vw"
					style={{ objectFit: 'cover' }}
				/>
			)}
		</div>
	);
}
