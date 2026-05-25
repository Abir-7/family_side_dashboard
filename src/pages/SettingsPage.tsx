import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { FormInput } from "@/components/forms/FormInput";
import { z } from "zod";

const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

type AccountFormData = z.infer<typeof accountSchema>;

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
  // Account state
  const [editingAccount, setEditingAccount] = useState(false);
  const [name, setName] = useState("Sarah");
  const [email, setEmail] = useState("example@gmail.com");
  const [phone, setPhone] = useState("000-0000-000");

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
          {editingAccount ? (
            <FormWrapper<AccountFormData>
              schema={accountSchema}
              onSubmit={(data) => {
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
                setEditingAccount(false);
              }}
              defaultValues={{ name, email, phone }}
              className="space-y-4"
            >
              <FormInput name="name" label="Name" placeholder="Sarah" />
              <FormInput
                name="email"
                label="Email Address"
                placeholder="example@gmail.com"
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
                >
                  Save Changes
                </Button>
              </div>
            </FormWrapper>
          ) : (
            <div>
              <FieldView label="Name" value={name} />
              <FieldView label="Email Address" value={email} />
              <FieldView label="Phone Number" value={phone} />
            </div>
          )}
        </SectionCard>

        {/* ── Change Password ── */}
        <SectionCard
          editing={editingSecurity}
          onEdit={() => setEditingSecurity(true)}
        >
          {editingSecurity ? (
            <FormWrapper
              schema={z.object({
                currentPassword: z.string().min(1, "Required"),
                newPassword: z.string().min(1, "Required"),
                confirmPassword: z.string().min(1, "Required"),
              })}
              onSubmit={() => setEditingSecurity(false)}
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
                >
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
