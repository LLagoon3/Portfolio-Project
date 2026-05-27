// 어드민 폼의 섹션 단위 래퍼. 제목/설명/본문을 일관된 간격으로 묶는다.
function AdminFormSection({ title, description, action, children }) {
	return (
		<section className="mb-8 rounded-xl border border-gray-200 dark:border-ternary-dark bg-secondary-light dark:bg-secondary-dark p-5 sm:p-6">
			<header className="flex items-start justify-between gap-3 mb-4">
				<div>
					<h2 className="font-general-medium text-xl text-primary-dark dark:text-primary-light">
						{title}
					</h2>
					{description && (
						<p className="font-general-regular text-sm text-ternary-dark dark:text-ternary-light mt-1">
							{description}
						</p>
					)}
				</div>
				{action && <div className="shrink-0">{action}</div>}
			</header>
			<div>{children}</div>
		</section>
	);
}

export default AdminFormSection;
