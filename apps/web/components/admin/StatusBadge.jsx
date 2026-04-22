// 어드민에서 Contact 제출 status 를 한눈에 보여주는 배지. 기존 팔레트 안에서만 톤 조합.
const STATUS_STYLES = {
	pending: {
		label: 'Pending',
		className:
			'bg-gray-100 text-primary-dark dark:bg-ternary-dark dark:text-ternary-light',
	},
	read: {
		label: 'Read',
		className:
			'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
	},
	replied: {
		label: 'Replied',
		className:
			'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
	},
};

function StatusBadge({ status }) {
	const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-general-medium ${style.className}`}
		>
			{style.label}
		</span>
	);
}

export default StatusBadge;
