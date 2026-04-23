// 어드민 목록 테이블 공용 컴포넌트.
// columns: [{ key, label, render?: (row) => node, className?: string }]
// rows:    [row]
// actions: (row) => node  (optional, 우측 액션 열)
// emptyMessage: 빈 상태 문구
function AdminTable({ columns, rows, actions, emptyMessage = '데이터가 없습니다.' }) {
	const showActions = typeof actions === 'function';

	if (!rows || rows.length === 0) {
		return (
			<div className="font-general-regular text-ternary-dark dark:text-ternary-light rounded-xl border border-gray-200 dark:border-secondary-dark p-6 text-center">
				{emptyMessage}
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-secondary-dark">
			<table className="min-w-full font-general-regular">
				<thead className="bg-ternary-light dark:bg-ternary-dark text-primary-dark dark:text-primary-light">
					<tr>
						{columns.map((col) => (
							<th
								key={col.key}
								className={`px-4 py-3 text-left text-sm font-general-medium ${col.className ?? ''}`}
							>
								{col.label}
							</th>
						))}
						{showActions && (
							<th className="px-4 py-3 text-right text-sm font-general-medium">
								Actions
							</th>
						)}
					</tr>
				</thead>
				<tbody className="bg-secondary-light dark:bg-secondary-dark divide-y divide-gray-200 dark:divide-ternary-dark">
					{rows.map((row, idx) => (
						<tr key={row.id ?? idx}>
							{columns.map((col) => (
								<td
									key={col.key}
									className={`px-4 py-3 text-ternary-dark dark:text-ternary-light text-sm ${col.className ?? ''}`}
								>
									{col.render ? col.render(row) : row[col.key]}
								</td>
							))}
							{showActions && (
								<td className="px-4 py-3 text-right whitespace-nowrap">
									<div className="flex justify-end gap-2">
										{actions(row)}
									</div>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default AdminTable;
