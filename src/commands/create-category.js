class CreateCategoryError extends Error {
}

/**
 *
 * @param {BackendRepository} repository
 * @returns {(function(string):Promise<string>)}
 */
module.exports = function createCategory (repository) {
  return async (name) => {
    // TODO: maybe we should check if a category with the given name already exists

    if (name.length === 0) {
      throw new CreateCategoryError('name must not be empty')
    }

    if (name.length > 255) {
      throw new CreateCategoryError('name exceeds maximum length')
    }

    return repository.createCategory(name)
  }
}

module.exports.CreateCategoryError = CreateCategoryError
