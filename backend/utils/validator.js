class ValidatorUtils {
  static async errorMapped(req, res, next) {
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return res.status(400).json(result.mapped());
    }
    return next();
  }

  static async idValidator(req, res, next) {
    req.checkParams('id', 'Id not valid.').notEmpty().isInt();
    return await ValidatorUtils.errorMapped(req, res, next);
  }

}

module.exports = ValidatorUtils;
