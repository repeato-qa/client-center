import axios, { AxiosError } from 'axios';
import { Environment } from './create-store';

const salt = 'RepeatoRccSalt';
export let envConfig: Environment;

export const config = () => {
  envConfig = {
    api_end_point: process.env.NEXT_PUBLIC_API_BASE,
    repeato_app: 'repeato://',
  };
  return envConfig;
};

export const validate = (value: any, rules: string) => {
  let error = '';
  if (!rules) return '';

  const rulesArr = rules.split('|');

  rulesArr.forEach((rule) => {
    if (error) return error;

    const breakRule = rule.split(':');

    if (breakRule[0] === 'required' && !value) error = 'Required field.';
    if (breakRule[0] === 'min' && value.length < breakRule[1])
      error = `Field length must be minimum ${breakRule[1]} characters.`;
    if (breakRule[0] === 'max' && value.length > breakRule[1])
      error = `Field length must not be greater than ${breakRule[1]} characters.`;
    if (breakRule[0] === 'email' && !/\S+@\S+\.\S+/.test(value))
      error = `Provide valid email address.`;
    if (breakRule[0] === 'password' && value.length < 8)
      error = `Password must be atleast of 8 characters.`;
  });

  return error;
};

export const throwIf = (condition: any, message: string) => {
  if (condition) throw new Error(message);
};

export const getParamsFromUrl = (url: string) => {
  const query = url.substr(1);
  const result: any = {};

  query.split('&').forEach(function (part) {
    const item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });

  return result;
};

export const crypt = (text: string) => {
  const textToChars = (text: string) =>
    text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n: any) => ('0' + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code: any) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
};

export const decrypt = (encoded: string) => {
  const textToChars = (text: string) =>
    text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code: any) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  // @ts-ignore
  return encoded
    .match(/.{1,2}/g)
    .map((hex: any) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode: any) => String.fromCharCode(charCode))
    .join('');
};

export const parseGetErrMsg = (err: Error | AxiosError) =>
  axios.isAxiosError(err)
    ? err?.response?.data?.error?.message || err?.response?.data?.message
    : err?.message;
