import type {
  IRegisterObject,
  ILoginObject,
  IChangePasswordForm,
} from "../interfaces/auth.interface";

/******* register default values *******/
export const RegisterationDefaultValues: IRegisterObject = {
  name: "",
  username: "",
  email: "",
  password: "",
  rePassword: "",
  dateOfBirth: "",
  gender: "",
};

/******* login default values *******/
export const LoginDefaultValues: ILoginObject = {
  email: "",
  password: "",
};

/******* change password default values *******/
export const ChangePasswordDefaultValues: IChangePasswordForm = {
  password: "",
  newPassword: "",
  rePassword: "",
};