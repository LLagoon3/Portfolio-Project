import { useCallback, useEffect, useRef, useState } from 'react';
import { FiRefreshCw, FiUploadCloud, FiX } from 'react-icons/fi';

// 어드민에서 이미지를 업로드하고 결과 URL 을 form 상태에 전달하는 공용 컴포넌트.
// props
//   value: 현재 저장된 URL (비어있으면 빈 업로드 박스 노출)
//   onChange: (newUrl: string) => void  — 업로드 성공 시 호출
//   previewAlt: img alt 텍스트
//   className: 외곽 래퍼 커스터마이징

function formatBytes(bytes) {
	if (bytes == null || Number.isNaN(bytes)) return null;
	if (bytes < 1024) return `${bytes}B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10}KB`;
	return `${Math.round(bytes / (1024 * 102.4)) / 10}MB`;
}

function ImageUploader({ value, onChange, previewAlt = 'Upload preview', className = '' }) {
	const inputRef = useRef(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState('');
	const [dragOver, setDragOver] = useState(false);
	// 해상도 · 용량 · MIME. 업로드 직후엔 서버 응답에서, prefill/기존 URL 에는 img.onload 로 해상도만 채움.
	const [meta, setMeta] = useState({
		width: null,
		height: null,
		bytes: null,
		mime: null,
	});

	// value 가 바뀌면 해상도 재측정(업로드 메타는 handleFiles 가 별도로 덮어쓴다).
	useEffect(() => {
		setMeta((prev) => ({
			width: null,
			height: null,
			bytes: prev.bytes,
			mime: prev.mime,
		}));
	}, [value]);

	const handleImageLoad = useCallback((event) => {
		const img = event.currentTarget;
		setMeta((prev) => ({
			...prev,
			width: img.naturalWidth,
			height: img.naturalHeight,
		}));
	}, []);

	async function handleFiles(fileList) {
		if (!fileList || fileList.length === 0) return;
		setError('');
		setUploading(true);
		try {
			const form = new FormData();
			form.append('file', fileList[0]);
			const res = await fetch('/api/admin/uploads', {
				method: 'POST',
				credentials: 'include',
				body: form,
			});
			if (res.status === 401) {
				setError('로그인이 만료되었습니다. 다시 로그인 해주세요.');
				return;
			}
			const payload = await res.json().catch(() => null);
			if (!res.ok) {
				setError(payload?.error?.message ?? `업로드 실패 (${res.status})`);
				return;
			}
			const data = payload?.data;
			if (!data?.url) {
				setError('서버가 URL 을 돌려주지 않았습니다.');
				return;
			}
			setMeta({
				width: null,
				height: null,
				bytes: data.bytes ?? null,
				mime: data.mime ?? null,
			});
			onChange(data.url);
		} catch (err) {
			console.error('[ImageUploader] failed', err);
			setError('네트워크 오류로 업로드에 실패했습니다.');
		} finally {
			setUploading(false);
			if (inputRef.current) inputRef.current.value = '';
		}
	}

	function openPicker() {
		if (uploading) return;
		inputRef.current?.click();
	}

	function handleDrop(event) {
		event.preventDefault();
		setDragOver(false);
		handleFiles(event.dataTransfer?.files);
	}

	function handleDragOver(event) {
		event.preventDefault();
		if (!dragOver) setDragOver(true);
	}

	function handleDragLeave() {
		setDragOver(false);
	}

	function clear() {
		if (uploading) return;
		setMeta({ width: null, height: null, bytes: null, mime: null });
		onChange('');
	}

	const metaLabel = [
		meta.width && meta.height ? `${meta.width}×${meta.height}` : null,
		formatBytes(meta.bytes),
		meta.mime,
	]
		.filter(Boolean)
		.join(' · ');

	const dropRingClass = dragOver
		? 'ring-2 ring-indigo-400 dark:ring-indigo-500'
		: '';

	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{value ? (
				<div
					className={`relative inline-block rounded-md ${dropRingClass}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={value}
						alt={previewAlt}
						onLoad={handleImageLoad}
						className="rounded-md max-h-40 border border-gray-200 dark:border-ternary-dark"
					/>
					<div className="absolute top-1 right-1 flex gap-1">
						<button
							type="button"
							onClick={openPicker}
							disabled={uploading}
							aria-label="Replace image"
							title="교체"
							className="p-1 rounded-full bg-white/90 dark:bg-secondary-dark/90 text-ternary-dark hover:text-indigo-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<FiRefreshCw className={`w-4 h-4 ${uploading ? 'animate-spin' : ''}`} />
						</button>
						<button
							type="button"
							onClick={clear}
							disabled={uploading}
							aria-label="Remove image"
							title="제거"
							className="p-1 rounded-full bg-white/90 dark:bg-secondary-dark/90 text-ternary-dark hover:text-red-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<FiX className="w-4 h-4" />
						</button>
					</div>
					{metaLabel && (
						<p className="mt-1 text-xs text-ternary-dark dark:text-ternary-light font-general-regular">
							{metaLabel}
						</p>
					)}
					<p className="mt-0.5 text-xs text-ternary-dark dark:text-ternary-light break-all">
						{value}
					</p>
				</div>
			) : (
				<button
					type="button"
					onClick={openPicker}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={`flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 dark:border-ternary-dark rounded-md px-4 py-6 text-ternary-dark dark:text-ternary-light hover:border-indigo-400 dark:hover:border-indigo-500 duration-300 ${dropRingClass}`}
				>
					<FiUploadCloud className="w-6 h-6" />
					<span className="text-sm font-general-medium">
						{uploading ? '업로드 중…' : '클릭하거나 이미지를 드롭하세요'}
					</span>
					<span className="text-xs">JPEG / PNG / WebP · 최대 5MB</span>
				</button>
			)}
			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				className="hidden"
				onChange={(e) => handleFiles(e.target.files)}
			/>
			{error && (
				<p className="text-sm text-red-500 dark:text-red-400" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}

export default ImageUploader;
