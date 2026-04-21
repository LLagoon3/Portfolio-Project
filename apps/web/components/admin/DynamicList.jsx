import { FiArrowDown, FiArrowUp, FiPlus, FiTrash2 } from 'react-icons/fi';

// 어드민 폼의 N 행 컨트롤. 값 추가/삭제/상/하 이동을 공용화한다.
// props:
//   items: 배열
//   onChange: (nextItems) => void
//   renderItem: (item, index, onItemChange) => node  — onItemChange(partial)
//   emptyItem: () => newItem  (추가 버튼 눌렀을 때 생성)
//   addLabel: 버튼 라벨 (기본 '추가')
//   minLength: 최소 개수 (기본 0)
function DynamicList({
	items,
	onChange,
	renderItem,
	emptyItem,
	addLabel = '추가',
	minLength = 0,
}) {
	function update(index, partial) {
		const next = items.map((it, i) =>
			i === index ? { ...it, ...partial } : it,
		);
		onChange(next);
	}

	function add() {
		onChange([...items, emptyItem()]);
	}

	function remove(index) {
		if (items.length <= minLength) return;
		onChange(items.filter((_, i) => i !== index));
	}

	function move(index, delta) {
		const target = index + delta;
		if (target < 0 || target >= items.length) return;
		const next = [...items];
		[next[index], next[target]] = [next[target], next[index]];
		onChange(next);
	}

	return (
		<div className="flex flex-col gap-3">
			{items.map((item, i) => (
				<div
					key={item._key ?? i}
					className="rounded-lg border border-gray-200 dark:border-ternary-dark bg-primary-light dark:bg-ternary-dark p-3 sm:p-4"
				>
					<div className="flex justify-between items-start gap-2 mb-2">
						<span className="font-general-medium text-xs text-ternary-dark dark:text-ternary-light">
							#{i + 1}
						</span>
						<div className="flex gap-1">
							<button
								type="button"
								onClick={() => move(i, -1)}
								disabled={i === 0}
								aria-label="Move up"
								className="p-1.5 rounded hover:bg-ternary-light dark:hover:bg-secondary-dark disabled:opacity-30 disabled:cursor-not-allowed"
							>
								<FiArrowUp className="w-4 h-4" />
							</button>
							<button
								type="button"
								onClick={() => move(i, 1)}
								disabled={i === items.length - 1}
								aria-label="Move down"
								className="p-1.5 rounded hover:bg-ternary-light dark:hover:bg-secondary-dark disabled:opacity-30 disabled:cursor-not-allowed"
							>
								<FiArrowDown className="w-4 h-4" />
							</button>
							<button
								type="button"
								onClick={() => remove(i)}
								disabled={items.length <= minLength}
								aria-label="Remove"
								className="p-1.5 rounded text-red-500 hover:bg-red-50 dark:hover:bg-secondary-dark disabled:opacity-30 disabled:cursor-not-allowed"
							>
								<FiTrash2 className="w-4 h-4" />
							</button>
						</div>
					</div>
					<div>{renderItem(item, i, (partial) => update(i, partial))}</div>
				</div>
			))}
			<button
				type="button"
				onClick={add}
				className="flex items-center justify-center gap-1.5 font-general-medium text-sm text-indigo-600 dark:text-indigo-400 border border-dashed border-indigo-300 dark:border-indigo-700 rounded-lg py-2.5 hover:bg-indigo-50 dark:hover:bg-secondary-dark duration-300"
			>
				<FiPlus className="w-4 h-4" />
				{addLabel}
			</button>
		</div>
	);
}

export default DynamicList;
