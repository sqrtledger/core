import * as Joi from 'joi';
import { IAccount } from '../models';

export class AccountValidator {
  public static validate(account: IAccount): void {
    const joiObjectSchema = Joi.object({
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

    if (joiObjectSchema.validate(account).error) {
      throw new Error(joiObjectSchema.validate(account).error?.message);
    }
  }
}
