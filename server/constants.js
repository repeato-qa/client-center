// Active campaign constants
export const AC = {
  FIELD: '10',
  ONBOARDING_LIST: '2',
  DIRECT_COMMUNICATION_LIST: '3',
  PRODUCT_NEWSLETTER_LIST: '4',
};
export const ValidateProps = {
  user: {
    firstName: { type: 'string', minLength: 5, maxLength: 25 },
    lastName: { type: 'string', minLength: 2, maxLength: 25 },
    company: { type: 'string', minLength: 2, maxLength: 25 },
    password: { type: 'string', minLength: 8 },
    email: { type: 'string', minLength: 1 },
  },
  generic: {
    string: { type: 'string' },
  },
};
