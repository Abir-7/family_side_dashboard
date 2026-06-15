import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { FormInput } from "@/components/forms/FormInput";
import { z } from "zod";
import { useUpdateProfileMutation, useGetProfileQuery, useChangePasswordMutation } from "@/lib/redux/apis/userApi";
import { toast } from "sonner";

const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(1, "Required"),
  confirmPassword: z.string().min(1, "Required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AccountFormData = z.infer<typeof accountSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  title,
  subtitle,
  editing,
  onEdit,
  children,
}: {
  title?: string;
  subtitle?: string;
  editing: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  const hasTitle = !!title || !!subtitle;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5 relative">
      {/* Card header */}
      {hasTitle ? (
        <>
          <div className="flex items-start justify-between mb-1">
            <div>
              {title && (
                <h2 className="text-base font-semibold text-gray-800">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
              )}
            </div>
            {!editing && (
              <button
                onClick={onEdit}
                className="text-brand-400 hover:text-brand-500 transition-colors p-1"
              >
                <Pencil className="w-4 h-4" strokeWidth={1.8} />
              </button>
            )}
          </div>
          <hr className="border-gray-100 my-4" />
        </>
      ) : (
        /* Floating edit button when no title */
        !editing && (
          <button
            onClick={onEdit}
            className="absolute right-5 top-5 text-brand-400 hover:text-brand-500 transition-colors p-1 z-10"
          >
            <Pencil className="w-4 h-4" strokeWidth={1.8} />
          </button>
        )
      )}
      {children}
    </div>
  );
}

// ─── Field (view mode) ────────────────────────────────────────────────────────
function FieldView({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <p className="text-sm text-gray-500 mt-0.5">{value}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data: profileResponse, isLoading: isProfileLoading, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  // Account state
  const [editingAccount, setEditingAccount] = useState(false);
  const profile = profileResponse?.data;

  // Security state
  const [editingSecurity, setEditingSecurity] = useState(false);

  return (
    <div className="">
      <div className="flex flex-col gap-5">
        {/* ── Account ── */}
        <SectionCard
          title="Account"
          subtitle=""
          editing={editingAccount}
          onEdit={() => setEditingAccount(true)}
        >
          {isProfileLoading ? (
            <div className="flex justify-center p-4">
                <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            </div>
          ) : editingAccount ? (
            <FormWrapper<AccountFormData>
              schema={accountSchema}
              onSubmit={async (data) => {
                try {
                    await updateProfile({ name: data.name, phone_number: data.phone }).unwrap();
                    refetch();
                    setEditingAccount(false);
                    toast.success("Profile updated successfully");
                } catch (error: any) {
                    toast.error(error.data?.message || "Failed to update profile");
                }
              }}
              defaultValues={{ 
                name: profile?.name || "", 
                email: profile?.email || "", 
                phone: profile?.phone_number || "" 
              }}
              className="space-y-4"
            >
              <FormInput name="name" label="Name" placeholder="Name" />
              <FormInput
                name="email"
                label="Email Address"
                placeholder="example@gmail.com"
                disabled
              />
              <FormInput
                name="phone"
                label="Phone Number"
                placeholder="000-0000-000"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  onClick={() => setEditingAccount(false)}
                  className="h-11 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-full shadow-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 px-5 bg-brand-400 hover:bg-brand-500 text-white text-sm font-semibold rounded-full shadow-none"
                  disabled={isUpdating}
                >
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </FormWrapper>
          ) : (
            <div>
              <FieldView label="Name" value={profile?.name || ""} />
              <FieldView label="Email Address" value={profile?.email || ""} />
              <FieldView label="Phone Number" value={profile?.phone_number || ""} />
            </div>
          )}
        </SectionCard>

        {/* ── Change Password ── */}
        <SectionCard
          editing={editingSecurity}
          onEdit={() => setEditingSecurity(true)}
        >
          {editingSecurity ? (
            <FormWrapper<PasswordFormData>
              mode="onChange"
              schema={passwordSchema}
              onSubmit={async (data) => {
                try {
                    await changePassword({ 
                        current_password: data.currentPassword, 
                        new_password: data.newPassword 
                    }).unwrap();
                    toast.success("Password updated successfully");
                    setEditingSecurity(false);
                } catch (error: any) {
                    toast.error(error.data?.message || "Failed to update password");
                }
              }}
              className="space-y-4"
            >
              <FormInput
                name="currentPassword"
                label="Change Password"
                placeholder="Enter Password"
                type="password"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter New Password"
                  type="password"
                />
                <FormInput
                  name="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Re-enter Password"
                  type="password"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  onClick={() => setEditingSecurity(false)}
                  className="h-11 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-full shadow-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 px-5 bg-brand-400 hover:bg-brand-500 text-white text-sm font-semibold rounded-full shadow-none"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </div>
            </FormWrapper>
          ) : (
            <div>
              <FieldView label="Change Password" value="*********" />
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
