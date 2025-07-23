// import {
//   registerDecorator,
//   ValidationArguments,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';
// import {
//   SessionStatus,
//   QueueSubStatus,
//   HealingRoundSubStatus,
//   CompletionSubStatus,
// } from '../../enum';

// @ValidatorConstraint({ async: false })
// export class IsValidSubStatusConstraint
//   implements ValidatorConstraintInterface
// {
//   validate(sub_status: string, args: ValidationArguments) {
//     const status = args.object['status'] as SessionStatus;

//     switch (status) {
//       case SessionStatus.INTAKE:
//         return !sub_status; // No subStatus for INTAKE

//       case SessionStatus.IN_QUEUE:
//         return Object.values(QueueSubStatus).includes(
//           sub_status as QueueSubStatus
//         );

//       case SessionStatus.HEALING_ROUND:
//         return Object.values(HealingRoundSubStatus).includes(
//           sub_status as HealingRoundSubStatus
//         );

//       case SessionStatus.COMPLETED:
//         return Object.values(CompletionSubStatus).includes(
//           sub_status as CompletionSubStatus
//         );

//       case SessionStatus.CANCELLED:
//       case SessionStatus.ABANDONED:
//         return !sub_status;

//       default:
//         return false;
//     }
//   }

//   defaultMessage(args: ValidationArguments) {
//     const status = args.object['status'] as SessionStatus;
//     return `Invalid sub status for status ${status}`;
//   }
// }

// export function IsValidSubStatus(validationOptions?: ValidationOptions) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [],
//       options: validationOptions,
//       validator: IsValidSubStatusConstraint,
//     });
//   };
// }
