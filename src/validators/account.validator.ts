import * as Joi from 'joi';
import { IAccount } from '../models';

export class AccountValidator {
  public static valid(account: IAccount): boolean {
    const joiObjectSchema = Joi.object({
      availableBalance: Joi.number().required(),
      balance: Joi.number().required(),
      label: Joi.string().alphanum().min(3).max(32).required(),
      metadata: Joi.object().unknown().required(),
      name: Joi.string().alphanum().min(3).max(32).required(),
      reference: Joi.string().alphanum().min(3).max(32).required(),
      settings: Joi.object({
        allowTransactions: Joi.boolean().required(),
        allowCreditTransactions: Joi.boolean().required(),
        allowDebitTransactions: Joi.boolean().required(),
      }).required(),
      status: Joi.string().allow(['active', 'inactive']).required(),
    });

    return joiObjectSchema.validate(account).error ? false : true;
  }
}
