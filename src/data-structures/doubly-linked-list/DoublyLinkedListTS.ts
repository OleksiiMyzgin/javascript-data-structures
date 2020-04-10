export interface INode {
  value: number | string | { [ket: string]: any };
  next: DoublyLinkedListNode | null;
  previous: DoublyLinkedListNode | null;
  toString(fn?: Fn): string;
}

export type Fn = (value: { [ket: string]: any }) => string;

export class DoublyLinkedListNode implements INode {
  constructor(
    public value: number | string | { [ket: string]: any },
    public next: DoublyLinkedListNode | null = null,
    public previous: DoublyLinkedListNode | null = null,
  ) {}

  public toString(callback?: Fn): string {
    return callback
      ? callback(this.value as { [ket: string]: any })
      : `${this.value}`;
  }
}

export interface INodeList {
  head: DoublyLinkedListNode | null;
  tail: DoublyLinkedListNode | null;
}

export class DoublyLinkedList implements INodeList {
  public head: DoublyLinkedListNode | null = null;
  public tail: DoublyLinkedListNode | null = null;

  // добавляем узел в начало списка
  public prepend(value: number | string | {}): DoublyLinkedList {
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
  public append(value: number | string | {}): DoublyLinkedList {
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

  public delete(value: number | string | {}): DoublyLinkedListNode | null {
    if (!this.head) {
      return null;
    }

    let deletedNode = null;
    let currentNode = this.head as DoublyLinkedListNode | null;

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

          // Установить tail на предпоследний узел, который станет новым tail.
          this.tail = deletedNode.previous as DoublyLinkedListNode;
          this.tail.next = null;
        } else {
          // Если средний узел будет удален ...
          const previousNode = deletedNode.previous as DoublyLinkedListNode;
          const nextNode = deletedNode.next as DoublyLinkedListNode;

          previousNode.next = nextNode;
          nextNode.previous = previousNode;
        }
      }

      currentNode = currentNode.next;
    }

    return deletedNode;
  }

  public find(
    value?: number | string | {} | undefined,
  ): DoublyLinkedListNode | null {
    if (!this.head) {
      return null;
    }

    let currentNode: DoublyLinkedListNode | null = this.head;

    while (currentNode) {
      // Если указано значение, пробуем сравнить по значению
      if (value !== undefined && currentNode.value === value) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  public deleteTail(): DoublyLinkedListNode | null {
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

  public deleteHead(): DoublyLinkedListNode | null {
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

  public fromArray(values: Array<number | string | {}>): DoublyLinkedList {
    values.forEach((value: number | string | {}) => this.append(value));

    return this;
  }

  public toArray(): DoublyLinkedListNode[] {
    const nodes = [];

    let currentNode = this.head;
    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  public toString(callback?: Fn): string {
    return this.toArray()
      .map((node) => node.toString(callback))
      .toString();
  }

  public reverse(): DoublyLinkedList {
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
