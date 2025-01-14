import * as yup from 'yup';

export const searchSchema = yup.object().shape({
  keyword: yup.string().required().min(1),
});
