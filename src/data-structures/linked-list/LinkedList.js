class LinkedListNode {
	constructor(value, next = null) {
		this.value = value;
		this.next = next;
	}

	toString() {
		return `${this.value}`;
	}
}

export default class LinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
	}

	// добавляем узел в начало списка
	prepend(value) {
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
	append(value) {
		// Создаем новый узел
		const newNode = new LinkedListNode(value);

		// Если нет head или tail, делаем новый узел head и tail.
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

	delete(value) {
		if (!this.head) {
			return null;
		}

		let deletedNode = null;

		// Если head должен быть удален, то сделать следующий узел, новым head.
		while (this.head && this.head.value === value) {
			deletedNode = this.head;
			this.head = this.head.next;
		}

		let currentNode = this.head;

		if (currentNode !== null) {
			// Если следующий узел должен быть удален, делаем следующий узел через один, следующим.
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

	find(value) {
		if (!this.head) {
			return null;
		}

		let currentNode = this.head;

		while (currentNode) {
			// Если указано значение, пробуем сравнить по значению
			if (value !== undefined && currentNode.value === value) {
				return currentNode;
			}

			currentNode = currentNode.next;
		}

		return null;
	}

	deleteTail() {
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
		while (currentNode.next) {
			if (!currentNode.next.next) {
				currentNode.next = null;
			} else {
				currentNode = currentNode.next;
			}
		}

		this.tail = currentNode;

		return deletedTail;
	}

	deleteHead() {
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
	fromArray(values) {
		values.forEach(value => this.append(value));

		return this;
	}

	// Создаем массив всех узлов
	toArray() {
		const nodes = [];

		let currentNode = this.head;
		while (currentNode) {
			nodes.push(currentNode);
			currentNode = currentNode.next;
		}

		return nodes;
	}

	// Создаем строку из всех значение узлов
	toString() {
		return this.toArray().toString();
	}

	// Обратный список
	reverse() {
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

		// Сбрось head и tail.
		this.tail = this.head;
		this.head = prevNode;

		return this;
	}
}
