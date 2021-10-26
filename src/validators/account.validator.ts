import * as Joi from 'joi';
import { IAccount } from '../models';

export class AccountValidator {
  protected static joiObjectSchema = Joi.object({
    availableBalance: Joi.number().required(),
    balance: Joi.number().required(),
    label: Joi.string().alphanum().min(5).max(32).required(),
    metadata: Joi.object().unknown().required(),
    name: Joi.string().alphanum().min(5).max(32).required(),
    reference: Joi.string().alphanum().min(5).max(32).required(),
    settings: Joi.object({
      allowTransactions: Joi.boolean().required(),
      allowCreditTransactions: Joi.boolean().required(),
      allowDebitTransactions: Joi.boolean().required(),
    }).required(),
    status: Joi.string().valid('active', 'inactive').required(),
  });

  public static validate(account: IAccount): void {
    const joiValidationResult =
      AccountValidator.joiObjectSchema.validate(account);

    if (joiValidationResult.error) {
      throw new Error(joiValidationResult.error.message);
    }
  }
}
