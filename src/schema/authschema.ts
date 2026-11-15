import { z } from "zod";

/******* password  used by register, login and change password *******/

function passwordRule(name: string) {
  return z
    .string()
    .min(1, `${name} Is Required`)
    .min(8, `${name} Can't Be Less Than 8 Characters`)
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      `${name} Must Contain Capital Letter, Small Letter, Number and One Of These: # ? ! @ $ % ^ & * -`
    );
}

/******* register schema *******/
export const registerationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name Is Required")
      .min(3, "Name Should Be More Than 3 Characters")
      .max(15, "Name Shouldn't Exceed 15 Characters"),
    username: z
      .string()
      .trim()
      .min(1, "User Name Is Required")
      .min(3, "User Name Should Be More Than 3 Characters")
      .max(15, "User Name Shouldn't Exceed 15 Characters"),
    email: z.email("Invalid Email"),
    password: passwordRule("Password"),
    rePassword: z.string().min(1, "Re Password Is Required"),
    dateOfBirth: z
      .string()
      .min(1, "Choose Date Of Birth")
      .refine(
        function (value) {
          return new Date().getFullYear() - Number(value.slice(0, 4)) >= 18;
        },
        { error: "You Must Be At Least 18 Years Old" }
      ),
    gender: z.string().refine(
      function (value) {
        if (value === "male" || value === "female") {
          return true;
        }
        return false;
      },
      { error: "Please Select a Gender" }
    ),
  })
  .refine(
    function (values) {
      return values.password === values.rePassword;
    },
    {
      error: "Passwords Don't Match",
      path: ["rePassword"],
    }
  );

/******* login schema *******/
export const loginSchema = z.object({
  email: z.email("Invalid Email"),
  password: passwordRule("Password"),
});

/******* change password schema *******/
export const changePasswordSchema = z
  .object({
    password: passwordRule("Current Password"),
    newPassword: passwordRule("New Password"),
    rePassword: z.string().min(1, "Re Password Is Required"),
  })
  .refine(
    function (values) {
      return values.password !== values.newPassword;
    },
    {
      error: "New Password Must Be Different From The Current One",
      path: ["newPassword"],
    }
  )
  .refine(
    function (values) {
      return values.newPassword === values.rePassword;
    },
    {
      error: "Passwords Don't Match",
      path: ["rePassword"],
    }
  );