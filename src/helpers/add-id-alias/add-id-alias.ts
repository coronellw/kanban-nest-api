/**
   * Helper method to add _id field to board objects
   */
export function addIdAlias<T extends { id: number }>(item: T) {
    return { ...item, _id: item.id };
}

/**
     * Helper method to add _id field to array of boards
     */
export function addIdAliasToArray<T extends { id: number }>(boards: T[]) {
    return boards.map(board => addIdAlias(board));
}