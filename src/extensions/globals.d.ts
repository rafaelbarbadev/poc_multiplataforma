export {};

declare global {
    interface String {
      /**
       * @description Verifica se string contém outras
       * @param T : Strings de comparação
       * @returns boolean
       */
      like(...T: Array<string>): boolean;

      /**
       * @description Substitui todas as ocorrencias da string buscada pela nova string
       * @param search : Strings de busca
       * @param replacement : Strings de sobrescrita
       * @returns string
       */
      replaceAll(search: string, replacement: string): string;
    }

    interface Array<T> {
      /**
       * @description Agrupador de array baseado em uma chave
       * @param T : função opcional definindo chave agrupadora
       * @returns array de chave e valor
       */
      groupBy(T?: (T: any) => {}): Array<any>;

      /**
       * @description Ordenador de array  modo ascendente
       * @param T : função opcional definindo chave de ordenação
       * @returns array
       */
      orderBy(T?: (T: any) => {}, T2?: (T: any) => {}): Array<any>;

      /**
       * @description Ordenador de array  modo decrescente
       * @param T : função opcional definindo chave de ordenação
       * @returns array
       */
      orderByDesc(T?: (T: any) => {}, T2?: (T: any) => {}): Array<any>;

      /**
       * @description Recupera primeiro resultado da pesquisa dentro do array
       * @param T : função opcional booleana que define o filtro executado no array
       * @returns any
       */
      firstOrDefault(T?: (T: any) => {}): any | null;

      /**
       * @description Determina se existe algum elemento no array
       * @param T função opcional booleana que define se existe ou não determinado dado
       * @returns boolean
       */
      any(T?: (T: any) => {}): boolean;

      move(from: number, to: number): void;
    }
}
