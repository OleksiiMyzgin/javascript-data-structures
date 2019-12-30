class LinkedListNode {
	constructor(
		public value: number | string | {},
		public next: LinkedListNode | null = null,
		) {}

	public toString(callback?: (v: number | string | {}) => string): string {
		return callback ? callback(this.value) : `${this.value}`;
	}
}

export default class LinkedList {
	private head: LinkedListNode | null = null;
	private tail: LinkedListNode | null = null;

	// добавляем узел  в начало списка
	public prepend(value: number | string | {}): LinkedList {
		// Создаем новый узел, который будет head
		const newNode = new LinkedListNode(value, this.head);
		this.head = newNode;

		// Если еще нет tail, сделаем новый узел tail.
		if (!this.tail) {
			this.tail = newNode;
		}

		return this;
	}

	// добавляем узел в конец списка
	public append(value: number | string | {}): LinkedList {
		// Создаем новый узел
		const newNode = new LinkedListNode(value);

		// Если нет head или tail, сделаем новый узел head и tail.
		if (!this.head || !this.tail) {
			this.head = newNode;
			this.tail = newNode;

			return this;
		}

		// Присоединяем новый узел к концу связанного списка.
		this.tail.next = newNode;
		// Переназначаем tail на новый узел
		this.tail = newNode;

		return this;
	}

	public delete(value: number | string | {}): LinkedListNode | null {
		if (!this.head) {
			return null;
		}

		let deletedNode = null;

		// If the head must be deleted then make next node that is differ
		// from the head to be a new head.

		// Если head должен быть удален, то сделать следующий узел, новым head.
		while (this.head && this.head.value === value) {
			deletedNode = this.head;
			this.head = this.head.next;
		}

		let currentNode = this.head;

		if (currentNode !== null) {
			// Если следующий узел должен быть удален, сделай следующий узел следующим через один.
			while (currentNode.next) {
				if (currentNode.next.value === value) {
					deletedNode = currentNode.next;
					// Перезаписываем, что бы узел через один стал следующим узелом
					currentNode.next = currentNode.next.next;
				} else {
					currentNode = currentNode.next;
				}
			}
		}

		// Проверка, должен ли tail быть удален.
		if (this.tail && this.tail.value === value) {
			this.tail = currentNode;
		}

		return deletedNode;
	}

	public find(value?: number | string | {} | undefined): LinkedListNode | null {
		if (!this.head) {
			return null;
		}

		let currentNode: LinkedListNode | null = this.head;

		while (currentNode) {
			// Если указано значение, попробуй сравнить по значению
			if (value !== undefined && currentNode.value === value) {
				return currentNode;
			}

			currentNode = currentNode.next;
		}

		return null;
	}

	public deleteTail(): LinkedListNode | null {
		const deletedTail = this.tail;

		if (this.head === this.tail) {
			// В связанном списке только один узел.
			this.head = null;
			this.tail = null;

			return deletedTail;
		}

		// Если в связанном списке много узлов
		// Находим предпоследний узел и убираем ссылку «next» на последний узел
		let currentNode = this.head;
		while (currentNode && currentNode.next) {
			if (!currentNode.next.next) {
				currentNode.next = null;
			} else {
				currentNode = currentNode.next;
			}
		}

		this.tail = currentNode;

		return deletedTail;
	}

	public deleteHead(): LinkedListNode | null {
		if (!this.head) {
			return null;
		}

		const deletedHead = this.head;

		// Следующий елемент после head теперь будет head
		if (this.head.next) {
			this.head = this.head.next;
		} else {
			this.head = null;
			this.tail = null;
		}

		return deletedHead;
	}

	// Создаем новые узлы из массива и добавляем в конец списка
	public fromArray(values: Array<number | string | {}>): LinkedList {
		values.forEach((value: number | string | {}) => this.append(value));

		return this;
	}

	// Создаем массив всех узлов
	public toArray(): LinkedListNode[] {
		const nodes = [];

		let currentNode = this.head;
		while (currentNode) {
			nodes.push(currentNode);
			currentNode = currentNode.next;
		}

		return nodes;
	}

	// Создаем строку из всех значение узлов
	public toString(callback?: (v: number | string | {} ) => string): string {
		return this.toArray()
			.map(node => node.toString(callback))
			.toString();
	}

	// Обратный список
	public reverse(): LinkedList {
		let currNode = this.head;
		let prevNode = null;
		let nextNode = null;

		while (currNode) {
			// Сохраняем следующий узел.
			nextNode = currNode.next;

			// Меняем следующий узел текущего узла, чтобы он ссылался с предыдущий узел.
			currNode.next = prevNode;

			// Перемещаем узлы prevNode и currNode на один шаг вперед.
			prevNode = currNode;
			currNode = nextNode;
		}

		// Сбрасываем head и tail.
		this.tail = this.head;
		this.head = prevNode;

		return this;
	}
}
