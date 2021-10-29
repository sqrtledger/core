import * as Joi from 'joi';
import { ITransaction } from '../models';

export class TransactionValidator {
  protected static joiObjectSchema = Joi.object({
    amount: Joi.number().required(),
    collectionReference: Joi.string().min(5).max(32).optional().allow(null),
    metadata: Joi.object().unknown().required(),
    reference: Joi.string().min(5).max(32).required(),
    timestamp: Joi.number().min(new Date(2000, 0, 1).getTime()).required(),
    status: Joi.string()
      .valid('created', 'processed', 'completed', 'failed')
      .required(),
  });

  public static validate(transaction: ITransaction): void {
    const joiValidationResult =
      TransactionValidator.joiObjectSchema.validate(transaction);

    if (joiValidationResult.error) {
      throw new Error(joiValidationResult.error.message);
    }
  }
}
