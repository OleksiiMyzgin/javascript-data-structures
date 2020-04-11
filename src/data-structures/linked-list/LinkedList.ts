export interface INode {
  value: number | string | { [ket: string]: any };
  next: LinkedListNode | null;
  toString(fn?: Fn): string;
}

export type Fn = (value: { [ket: string]: any }) => string;
class LinkedListNode implements INode {
  constructor(
    public value: number | string | { [ket: string]: any },
    public next: LinkedListNode | null = null,
  ) {}

  public toString(callback?: Fn): string {
    return callback
      ? callback(this.value as { [ket: string]: any })
      : `${this.value}`;
  }
}

export interface INodeList {
  head: LinkedListNode | null;
  tail: LinkedListNode | null;
}

export class LinkedList implements INodeList {
  public head: LinkedListNode | null = null;
  public tail: LinkedListNode | null = null;

  public prepend(value: number | string | {}): LinkedList {
    /**
     * Создаём новый узел, который будет новым head,
     * при создании передаем второй аргумент, который указывает
     * что его "next" будет текущий head,
     * так как новый узел будет стоять перед текущем head.
     */
    const newNode = new LinkedListNode(value, this.head);

    /** Переназначаем head на новый узел. */
    this.head = newNode;

    /** Если ещё нет tail, делаем новый узел tail. */
    if (!this.tail) {
      this.tail = newNode;
    }

    /** Возвращаем весь список. */
    return this;
  }

  public append(value: number | string | {}): LinkedList {
    /** Создаём новый узел. */
    const newNode = new LinkedListNode(value);

    /** Если нет head или tail, делаем новым узлом head и tail. */
    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;

      return this;
    }

    /**
     * Присоединяем новый узел к концу связного списка.
     * Берём последний узел и указываем, что его next будет новым узлом.
     */
    this.tail.next = newNode;

    /** Переназначаем tail на новый узел. */
    this.tail = newNode;

    return this;
  }

  public delete(value: number | string | {}): LinkedListNode | null {
    /** Если нет head значит список пуст. */
    if (!this.head) {
      return null;
    }

    let deletedNode = null;

    /** Если head должен быть удален, то делаем следующий узел новым head. */
    while (this.head && this.head.value === value) {
      deletedNode = this.head;

      /** Переназначаем следующий за head узел на новый head. */
      this.head = this.head.next;
    }

    let currentNode = this.head;

    /**
     * Если следующий узел должен быть удален,
     * делаем узел через один, следующим для проверки.
     * Перебираем все узлы и удаляем их, если их значение равно указанному.
     */
    if (currentNode !== null) {
      while (currentNode.next) {
        if (currentNode.next.value === value) {
          deletedNode = currentNode.next;
          /** Перезаписываем, чтобы узел через один стал следующим узлом. */
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    /**
     * Проверяем, должен ли tail быть удален.
     * Так как, если в цикле мы удаляем последний узел,
     * то с предпоследнего узла убираем только ссылку на него.
     * Поэтому делаем проверку на его удаление с "tail".
     */
    if (this.tail && this.tail.value === value) {
      /** В данном случае currentNode это или предпоследний узел или head. */
      this.tail = currentNode;
    }

    return deletedNode;
  }

  public find(value?: number | string | {} | undefined): LinkedListNode | null {
    /** Если нет head значит список пуст. */
    if (!this.head) {
      return null;
    }

    let currentNode: LinkedListNode | null = this.head;

    /** Перебираем все узлы в поиске значения. */
    while (currentNode) {
      /** Если указано значение, пробуем сравнить его по значению. */
      if (value !== undefined && currentNode.value === value) {
        return currentNode;
      }

      /** Перематываем на один узел вперед. */
      currentNode = currentNode.next;
    }

    return null;
  }

  public deleteTail(): LinkedListNode | null {
    /** Если нет tail, значит список пуст. */

    if (!this.tail) {
      return null;
    }

    /** Сохраняем значение последнего узла. */
    const deletedTail = this.tail;

    /** Если head и tail равны, значит в списке только один узел. */
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;

      return deletedTail;
    }

    /**
     * Если в связном списке много узлов.
     * Перебираем все узлы и находим предпоследний узел,
     * убираем ссылку «next» на последний узел.
     */
    let currentNode = this.head;
    while (currentNode && currentNode.next) {
      /**
       * Если у следующего узла нет следующего узла,
       * значит текущий узел предпоследний.
       */
      if (!currentNode.next.next) {
        /** Убираем ссылку «next» на последний узел. */
        currentNode.next = null;
      } else {
        /** Перематываем на один узел вперед. */
        currentNode = currentNode.next;
      }
    }

    /**
     * В данном случае currentNode - это предпоследний узел или head,
     * который становится последним узлом.
     */
    this.tail = currentNode;

    return deletedTail;
  }

  public deleteHead(): LinkedListNode | null {
    /** Если нет head значит список пуст. */
    if (!this.head) {
      return null;
    }

    const deletedHead = this.head;

    /**
     * Если у head есть ссылка на следующий "next" узел
     * то делаем его новым head.
     */
    if (this.head.next) {
      this.head = this.head.next;
    } else {
      /**
       * Если у head нет ссылки на следующий "next" узел
       * то мы удаляем последний узел.
       */
      this.head = null;
      this.tail = null;
    }

    return deletedHead;
  }

  /** Создаём новые узлы из массива и добавляем в конец списка. */
  public fromArray(values: Array<number | string | {}>): LinkedList {
    values.forEach((value: number | string | {}) => this.append(value));

    return this;
  }

  /** Создаём массив из всех узлов */
  public toArray(): LinkedListNode[] {
    const nodes = [];

    let currentNode = this.head;

    /** Перебираем все узлы и добавляем в массив. */
    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    /** Возвращаем массив из всех узлов. */
    return nodes;
  }

  public toString(callback?: Fn): string {
    /** Сначала создаём массив из всех узлов. */
    return (
      this.toArray()
        /**
         * На каждом узле вызываем метод toString
         * что бы получить значение в виде строки.
         */
        .map((node) => node.toString(callback))
        /** Вызываем метод toString на массиве строк. */
        .toString()
    );
  }

  /** Обратный список */
  public reverse(): LinkedList {
    let currNode = this.head;
    let prevNode = null;
    let nextNode = null;

    /** Перебираем все узлы. */
    while (currNode) {
      /** Сохраняем следующий узел. */
      nextNode = currNode.next;

      /**
       * Меняем ссылку на следующий "next" узел текущего узла,
       * чтобы он ссылался на предыдущий узел.
       * Так как мы меняем их местами, нужно поменять и ссылки на узлы.
       * Изначально, первый узел не имеет предыдущего узла,
       * поэтому после перестановки его "next" станет "null".
       */
      currNode.next = prevNode;

      /**
       * Перемещаем узлы prevNode и currNode на один шаг вперед.
       *
       * Текущий узел делаем предыдущим.
       */

      prevNode = currNode;

      /** Следующий узел становится текущим. */
      currNode = nextNode;
    }

    /** Меняем head и tail местами. */
    this.tail = this.head;

    /**
     * В данном случае prevNode это последний узел,
     * поэтому, после reverse, он становится первым.
     *
     */
    this.head = prevNode;

    /** Возвращаем список. */
    return this;
  }
}
