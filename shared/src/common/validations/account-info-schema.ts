import * as yup from 'yup';
import { TITLE_REGEX } from './regex';

export const accountInfoSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .min(5, 'full name must be at least 5 characters')
    .max(30, 'full name must be at most 30 characters')
    .matches(
      TITLE_REGEX,
      'full name must consist of latin letters (upper and lower case), numbers, and symbols',
    )
    .required(),
  title: yup
    .string()
    .nullable()
    .notRequired()
    .max(30, 'title must be at most 30 characters'),
});
