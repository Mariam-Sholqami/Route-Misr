
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../schema/authschema";
import { ChangePasswordDefaultValues } from "../../defaultValues/AuthDefaultValues";
import useChangePassword from "../../Hooks/useChangePassword";
import type { IChangePasswordForm } from "../../interfaces/auth.interface";

export default function ChangePassword({ onDone }: { onDone: () => void }) {
  const { mutate, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChangePasswordForm>({
    defaultValues: ChangePasswordDefaultValues,
    resolver: zodResolver(changePasswordSchema),
  });

  function callChangePasswordAPI(values: IChangePasswordForm) {
    // the API takes only 2 fields
    mutate(
      { password: values.password, newPassword: values.newPassword },
      { onSuccess: onDone }
    );
  }

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={handleSubmit(callChangePasswordAPI)}
    >
      {/* current password */}
      <div>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Current Password"
          className="w-full rounded-xl bg-gray-100 px-5 py-4 outline-none transition focus:ring-2 focus:ring-blue-500"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-400 my-2">{errors.password.message}</p>
        )}
      </div>

      {/* new password */}
      <div>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="New Password"
          className="w-full rounded-xl bg-gray-100 px-5 py-4 outline-none transition focus:ring-2 focus:ring-blue-500"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-red-400 my-2">{errors.newPassword.message}</p>
        )}
      </div>

      {/* rePassword */}
      <div>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Confirm New Password"
          className="w-full rounded-xl bg-gray-100 px-5 py-4 outline-none transition focus:ring-2 focus:ring-blue-500"
          {...register("rePassword")}
        />
        {errors.rePassword && (
          <p className="text-red-400 my-2">{errors.rePassword.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 text-sm font-medium">
        <button
          type="button"
          onClick={onDone}
          disabled={isPending}
          className="rounded-full px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? "Changing..." : "Change password"}
        </button>
      </div>
    </form>
  );
}
