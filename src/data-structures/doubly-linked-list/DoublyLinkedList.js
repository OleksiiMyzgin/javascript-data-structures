class DoublyLinkedListNode {
	constructor(value, next = null, previous = null) {
		this.value = value;
		this.next = next;
		this.previous = previous;
	}

	toString(callback) {
		return callback ? callback(this.value) : `${this.value}`;
	}
}

export default class DoublyLinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
	}

	// добавляем узел в начало списка
	prepend(value) {
		// Создаем новый узел, который будет head
		const newNode = new DoublyLinkedListNode(value, this.head);

		// Если есть head, то он больше не будет head.
		// Поэтому делаем его предыдущую (previous) ссылку на новый узел (new head)
		// Затем делаем новый узел head.
		if (this.head) {
			this.head.previous = newNode;
		}
		this.head = newNode;

		// Если еще нет tail, сделаем новый узел tail.
		if (!this.tail) {
			this.tail = newNode;
		}

		return this;
	}

	// добавляем узел в конец списка
	append(value) {
		const newNode = new DoublyLinkedListNode(value);

		if (this.tail) {
			// Присоединяем новый узел к концу связанного списка.
			this.tail.next = newNode;
		}

		// Присоединяем текущий tail к предыдущей (previous) ссылке нового узла.
		newNode.previous = this.tail;

		// Переназначаем tail на новый узел
		this.tail = newNode;

		if (!this.head) {
			this.head = newNode;
		}

		return this;
	}

	delete(value) {
		if (!this.head) {
			return null;
		}

		let deletedNode = null;
		let currentNode = this.head;

		while (currentNode) {
			if (currentNode.value === value) {
				deletedNode = currentNode;

				if (deletedNode === this.head) {
					// Если head должен быть удален..

					// Сделать следующий узел, новым head
					this.head = deletedNode.next;

					// Установить в новом head сслыку (previous) на ноль.
					if (this.head) {
						this.head.previous = null;
					}

					// Если все узлы в списке имеют одинаковое значение,
					// которое передается в качестве аргумента,
					// тогда все узлы будут удалены, поэтому tail необходимо обновить.
					if (deletedNode === this.tail) {
						this.tail = null;
					}
				} else if (deletedNode === this.tail) {
					// Если tail должен быть удален

					// Установить tail на предпоследний узел, который станет новым хвостом.
					this.tail = deletedNode.previous;
					this.tail.next = null;
				} else {
					// Если средний узел будет удален ...
					const previousNode = deletedNode.previous;
					const nextNode = deletedNode.next;

					previousNode.next = nextNode;
					nextNode.previous = previousNode;
				}
			}

			currentNode = currentNode.next;
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
		if (!this.tail) {
			return null;
		}

		const deletedTail = this.tail;

		if (this.tail.previous) {
			this.tail = this.tail.previous;
			this.tail.next = null;
		} else {
			this.head = null;
			this.tail = null;
		}

		return deletedTail;
	}

	deleteHead() {
		if (!this.head) {
			return null;
		}

		const deletedHead = this.head;

		if (this.head.next) {
			this.head = this.head.next;
			this.head.previous = null;
		} else {
			this.head = null;
			this.tail = null;
		}

		return deletedHead;
	}

	fromArray(values) {
		values.forEach(value => this.append(value));

		return this;
	}

	toArray() {
		const nodes = [];

		let currentNode = this.head;
		while (currentNode) {
			nodes.push(currentNode);
			currentNode = currentNode.next;
		}

		return nodes;
	}

	toString(callback) {
		return this.toArray()
			.map(node => node.toString(callback))
			.toString();
	}

	reverse() {
		let currNode = this.head;
		let prevNode = null;
		let nextNode = null;

		while (currNode) {
			// Сохраняем следующий и предыдуший узел.
			nextNode = currNode.next;
			prevNode = currNode.previous;

			//  Меняем следующий узел текущего узла, чтобы он ссылался с предыдущий узел.
			currNode.next = prevNode;
			currNode.previous = nextNode;

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
