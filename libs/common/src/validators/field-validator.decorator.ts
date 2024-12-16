import { applyDecorators } from '@nestjs/common'
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  isDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
  ValidateIf,
  type ValidationOptions
} from 'class-validator'

import { ToBoolean } from './transform.decorator' // TODO: check this file
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES } from '../constants'
import { Match } from '../decorators/match.decorator'
import {
  IFieldOptions,
  INumberFieldOptions,
  INumberIdsFieldOptions,
  IStringFieldOptions,
  IPasswordFieldOptions,
  IBooleanFieldOptions,
  IEnumFieldOptions
} from './validators.interface'

export function IsUndefinable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_obj, value) => value !== undefined, options)
}

export function IsNullable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_obj, value) => value !== null, options)
}

export function NumberField(options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {}): PropertyDecorator {
  const { each } = options
  const decorators = [Type(() => Number)]

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Number, ...options }))
  }

  if (options.nullable) {
    decorators.push(IsNullable({ each }))
  } else {
    decorators.push(NotEquals(null, { each }))
  }

  if (options.int) {
    decorators.push(IsInt({ each }))
  } else {
    decorators.push(IsNumber({}, { each }))
  }

  if (options.positive) {
    decorators.push(IsPositive({ each }))
  }

  if (typeof options.min === 'number') {
    decorators.push(Min(options.min, { each, message: VALIDATION_MESSAGES.mustBeGreaterThan(options.min) }))
  }

  if (typeof options.max === 'number') {
    decorators.push(Max(options.max, { each, message: VALIDATION_MESSAGES.mustBeLessThan(options.max) }))
  }

  return applyDecorators(...decorators)
}

export function NumberFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & INumberFieldOptions = {}
): PropertyDecorator {
  return applyDecorators(IsUndefinable(options), NumberField({ required: false, nullable: true, ...options }))
}

export function NumberIdsField(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & INumberIdsFieldOptions = {}
): PropertyDecorator {
  return applyDecorators(
    options.optional ? IsOptional() : IsDefined(),
    IsArray(),
    ArrayMinSize(1),
    NumberField({ each: true, isArray: true, int: true, positive: true, example: [1, 2, 3], ...options }),
    ArrayUnique()
  )
}

export function StringField(options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {}): PropertyDecorator {
  const decorators = [IsString({ each: options.each })]

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, isArray: options.each, example: options.example, ...options }))
  }

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }))
  } else {
    decorators.push(NotEquals(null, { each: options.each }))
  }

  const minLength = options.minLength ?? 1

  decorators.push(
    MinLength(minLength, {
      each: options.each,
      message: VALIDATION_MESSAGES.lengthMustBeGreaterThan(minLength)
    })
  )

  if (options.maxLength) {
    decorators.push(
      MaxLength(options.maxLength, {
        each: options.each,
        message: VALIDATION_MESSAGES.lengthMustBeLessThan(options.maxLength)
      })
    )
  }

  if (options.matchKey) {
    decorators.push(Match(options.matchKey, options.matchMessage ? { message: options.matchMessage } : {}))
  }

  return applyDecorators(...decorators)
}

export function StringFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IStringFieldOptions = {}
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), StringField({ required: false, nullable: true, ...options }))
}

export function PasswordField(
  options: Omit<ApiPropertyOptions, 'type' | 'minLength'> & IPasswordFieldOptions = {}
): PropertyDecorator {
  const decorators = [
    StringField({ example: 'password', minLength: PASSWORD_MIN_LENGTH, maxLength: PASSWORD_MAX_LENGTH })
  ]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(NotEquals(null))
  }

  return applyDecorators(...decorators)
}

export function BooleanField(options: Omit<ApiPropertyOptions, 'type'> & IBooleanFieldOptions = {}): PropertyDecorator {
  const decorators = [ToBoolean(), IsBoolean()]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(NotEquals(null))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Boolean, ...options }))
  }

  return applyDecorators(...decorators)
}

export function BooleanFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IBooleanFieldOptions = {}
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), BooleanField({ required: false, nullable: true, ...options }))
}

export function EmailField(options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {}): PropertyDecorator {
  const decorators = [StringField({ ...options }), IsEmail()]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(NotEquals(null))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, example: 'example@gmail.com', ...options }))
  }

  return applyDecorators(...decorators)
}

export function EmailFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {}
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), EmailField({ required: false, nullable: true, ...options }))
}

// TODO: check this fields
export function ApiEnumProperty<TEnum>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type'> & { each?: boolean } = {}
): PropertyDecorator {
  const enumValue = getEnum() as Record<string, any>

  return ApiProperty({
    type: 'enum',
    enum: enumValue,
    ...options
  })
}

export function EnumField<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName' | 'isArray'> & IEnumFieldOptions = {}
): PropertyDecorator {
  const enumValue = getEnum()
  const decorators = [IsEnum(enumValue, { each: options.each })]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(NotEquals(null))
  }

  if (options.swagger !== false) {
    decorators.push(ApiEnumProperty(getEnum, { ...options, isArray: options.each }))
  }

  return applyDecorators(...decorators)
}

export function EnumFieldOptional<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'enum' | 'enumName'> & IEnumFieldOptions = {}
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), EnumField(getEnum, { required: false, ...options }))
}

export function DateField(options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {}): PropertyDecorator {
  const decorators = [
    /**
     * Note: using isDateString for more strict date validation
     * and then transforming. Processing validation in transform decorator
     * because we can't validate then transform using class-validator and class-transformer decorators.
     */
    Transform(({ value }) =>
      isDateString(value, { strict: true, strictSeparator: true }) ? new Date(value as string) : undefined
    ),
    IsDate()
  ]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(NotEquals(null))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Date, ...options }))
  }

  return applyDecorators(...decorators)
}

export function DateFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {}
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), DateField({ ...options, nullable: true, required: false }))
}

export function DateStringField(options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {}): PropertyDecorator {
  const decorators = [Type(() => String), IsDateString({ strict: true, strictSeparator: true })]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(NotEquals(null))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Date, ...options }))
  }

  return applyDecorators(...decorators)
}

export function DateStringFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {}
): PropertyDecorator {
  return applyDecorators(IsUndefinable(), DateStringField({ ...options, nullable: true, required: false }))
}
