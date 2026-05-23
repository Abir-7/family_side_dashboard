import { useState } from "react";
import { Pencil, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  title: string;
  subtitle: string;
  editing: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5">
      {/* Card header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        {!editing && (
          <button
            onClick={onEdit}
            className="text-rose-400 hover:text-rose-500 transition-colors p-1"
          >
            <Pencil className="w-4 h-4" strokeWidth={1.8} />
          </button>
        )}
      </div>
      <hr className="border-gray-100 my-4" />
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

// ─── Password Input ───────────────────────────────────────────────────────────
function PasswordInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border-gray-200 text-sm pr-10 focus-visible:ring-rose-200"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? (
          <EyeOff className="w-4 h-4" strokeWidth={1.6} />
        ) : (
          <Eye className="w-4 h-4" strokeWidth={1.6} />
        )}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  // Account info state
  const [editingAccount, setEditingAccount] = useState(false);
  const [name, setName] = useState("Sarah");
  const [email, setEmail] = useState("example@gmail.com");
  const [phone, setPhone] = useState("000-0000-000");

  // Security state
  const [editingSecurity, setEditingSecurity] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="">
      {/* Page heading */}
      <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
      <p className="text-sm text-gray-400 mt-0.5 mb-6">
        Manage your account and application preferences
      </p>

      <div className="flex flex-col gap-5">
        {/* ── Account Information ── */}
        <SectionCard
          title="Account Information"
          subtitle="Update your account details"
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
                  className="h-11 px-5 bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold rounded-full shadow-none"
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

        {/* ── Security ── */}
        <SectionCard
          title="Security"
          subtitle="Manage password and security settings"
          editing={editingSecurity}
          onEdit={() => setEditingSecurity(true)}
        >
          {editingSecurity ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <PasswordInput
                  placeholder="Enter Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <PasswordInput
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <PasswordInput
                    placeholder="Re-enter Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                  />
                </div>
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
                  onClick={() => setEditingSecurity(false)}
                  className="h-11 px-5 bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold rounded-full shadow-none"
                >
                  Update Password
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <FieldView label="Current Password" value="*********" />
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
