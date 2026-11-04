import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ProjectsIcon from '../ProjectsIcon';
import styles from './ProjectDetail.module.css';

const VIEWER_CAPTION_ID = 'project-viewer-caption';

// 갤러리 이미지는 API 에 크기 정보가 없어 원본 비율 그대로(width 100% / height auto) 그린다.
// 이미지 수가 홀수면 첫 장을 본문 폭 전체로 둔다.
function gallerySizes(fullWidth) {
	return fullWidth
		? '(max-width: 1050px) calc(100vw - 64px), 984px'
		: '(max-width: 700px) calc(100vw - 40px), (max-width: 1050px) 50vw, 480px';
}

// 각 화면은 버튼으로 열리는 이미지 보기(native modal <dialog>)를 가진다.
// - 열면 배경은 inert, 포커스는 닫기 버튼에 두고 Tab 으로 밖으로 나가지 않는다.
// - Escape / 닫기 버튼 / 이미지 바깥 클릭으로 닫고, 연 버튼으로 포커스를 돌려준다.
// - 열려 있는 동안 문서 스크롤을 막고, 닫히거나 언마운트(라우트 이동)되면 원래대로 되돌린다.
export default function ProjectDetailGallery({ images }) {
	const [activeIndex, setActiveIndex] = useState(null);
	const dialogRef = useRef(null);
	const closeRef = useRef(null);
	const stageRef = useRef(null);
	const triggerRef = useRef(null);
	const active = activeIndex === null ? null : images[activeIndex] ?? null;
	const isOpen = active !== null;

	const close = useCallback(() => setActiveIndex(null), []);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!isOpen || !dialog) return undefined;
		const root = document.documentElement;
		const previousOverflow = root.style.overflow;
		if (!dialog.open) {
			if (typeof dialog.showModal === 'function') dialog.showModal();
			else dialog.setAttribute('open', '');
		}
		root.style.overflow = 'hidden';
		closeRef.current?.focus();

		return () => {
			root.style.overflow = previousOverflow;
			if (dialog.open) {
				if (typeof dialog.close === 'function') dialog.close();
				else dialog.removeAttribute('open');
			}
			const trigger = triggerRef.current;
			if (trigger?.isConnected) trigger.focus({ preventScroll: true });
		};
	}, [isOpen]);

	const handleKeyDown = (event) => {
		if (event.key === 'Escape') {
			// 헤더의 모바일 메뉴 Escape 처리가 함께 동작하지 않도록 여기서 처리를 끝낸다.
			event.preventDefault();
			close();
		} else if (event.key === 'Tab') {
			// 대화상자 안의 조작 요소는 닫기 버튼 하나뿐이다.
			event.preventDefault();
			closeRef.current?.focus();
		}
	};

	// 브라우저가 직접 닫으려는 경우(뒤로 제스처 등)에도 상태와 포커스 복귀를 같은 경로로 처리한다.
	const handleCancel = (event) => {
		event.preventDefault();
		close();
	};

	const handleClose = () => {
		if (!dialogRef.current?.open) close();
	};

	const handleClick = (event) => {
		if (event.target === event.currentTarget || event.target === stageRef.current) close();
	};

	const odd = images.length % 2 === 1;

	return (
		<>
			<div className={`${styles.gallery} ${odd ? styles.galleryOdd : ''}`.trim()}>
				{images.map((image, index) => (
					<figure key={image.key}>
						<button
							type="button"
							className={styles.shot}
							aria-label={`${image.name} 크게 보기`}
							aria-haspopup="dialog"
							onClick={(event) => {
								triggerRef.current = event.currentTarget;
								setActiveIndex(index);
							}}
						>
							<Image
								src={image.src}
								alt={image.name}
								width={0}
								height={0}
								sizes={gallerySizes(odd && index === 0)}
								style={{ width: '100%', height: 'auto' }}
							/>
						</button>
						{image.caption ? <figcaption>{image.caption}</figcaption> : null}
					</figure>
				))}
			</div>

			{/* 닫힌 dialog 는 표시되지 않는다. 연 동안에만 원본 이미지를 불러온다.
			    바깥 클릭 닫기는 포인터 보조 수단이고, 키보드는 Escape / 닫기 버튼으로 닫는다. */}
			<dialog
				ref={dialogRef}
				className={styles.viewer}
				aria-labelledby={VIEWER_CAPTION_ID}
				tabIndex={-1}
				onKeyDown={handleKeyDown}
				onCancel={handleCancel}
				onClose={handleClose}
				onClick={handleClick}
			>
				<div className={styles.viewerBar}>
					<p id={VIEWER_CAPTION_ID}>{active?.name ?? ''}</p>
					<button
						ref={closeRef}
						type="button"
						className={styles.viewerClose}
						onClick={close}
						aria-label="닫기"
					>
						<ProjectsIcon name="close" />
					</button>
				</div>
				<div ref={stageRef} className={styles.viewerStage}>
					{active ? (
						// 크게 보기는 최적화 없이 원본 파일을 그대로 보여 준다.
						// eslint-disable-next-line @next/next/no-img-element
						<img src={active.src} alt={active.name} />
					) : null}
				</div>
			</dialog>
		</>
	);
}
