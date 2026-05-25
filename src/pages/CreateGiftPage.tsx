import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FormPillGroup } from "@/components/forms/FormPillGroup";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormLocationSearch } from "@/components/forms/FormLocationSearch";

const schema = z.object({
  location: z.string().min(1, "Location is required"),
  giftName: z.string().min(1, "Gift name is required"),
  whatsapp: z.string().min(1, "WhatsApp number is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  instagram: z.string().optional(),
  subCategory: z.array(z.string()).min(1),
  email: z.string().optional(),
  tags: z.array(z.string()).min(1),
  date: z.string().min(1, "Date is required"),
  photos: z.array(z.any()).optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const CATEGORY_OPTIONS = [
  { label: "Doctor", value: "doctor" },
  { label: "Nursery", value: "nursery" },
  { label: "Playground", value: "playground" },
  { label: "Sports", value: "sports" },
];

const SUBCATEGORY_OPTIONS = ["All", "Doctors", "Nurseries", "Playgrounds"];
const TAG_OPTIONS = ["Toddler", "Indoor", "Ongoing", "Paid", "Free"];

const inputStyle = {
  borderRadius: "8px",
  padding: "9px 14px",
  border: "1.5px solid #e0e0e0",
  fontSize: "13px",
  background: "#fff",
  outline: "none",
  width: "100%",
  fontFamily: "'DM Sans', sans-serif",
  color: "#374151",
};

export default function CreateGiftPage() {
  const navigate = useNavigate();

  const onSubmit = (data: FormValues) => {
    console.log("Submitted:", data);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mx-auto">
      <FormWrapper
        schema={schema}
        onSubmit={onSubmit}
        defaultValues={{
          subCategory: ["All"],
          tags: ["Toddler", "Paid"],
          photos: [],
        }}
        style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
      >
        {/* Location */}
        <FormLocationSearch name="location" placeholder="Enter your location" />

        {/* Row 1: Gift Name + WhatsApp */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="giftName"
            label="Gift Name"
            placeholder="Enter your gift name..."
            style={inputStyle}
          />
          <FormInput
            name="whatsapp"
            label="What's App Number"
            placeholder="Enter phone number..."
            style={inputStyle}
          />
        </div>

        {/* Row 2: Category + Price + Instagram */}
        <div className="grid grid-cols-3 gap-4">
          <FormSelect
            name="category"
            label="Category"
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
          />
          <FormInput
            name="price"
            label="Price*"
            placeholder="$00"
            style={inputStyle}
          />
          <FormInput
            name="instagram"
            label="Instagram Link"
            placeholder="Enter link..."
            style={inputStyle}
          />
        </div>

        {/* Row 3: Sub-category + Email */}
        <div className="grid grid-cols-2 gap-4">
          <FormPillGroup
            name="subCategory"
            label="Sub-category"
            options={SUBCATEGORY_OPTIONS}
          />
          <FormInput
            name="email"
            label="Email"
            placeholder="Enter email..."
            style={inputStyle}
          />
        </div>

        {/* Row 4: Tag + Date */}
        <div className="grid grid-cols-2 gap-4">
          <FormPillGroup name="tags" label="Tag" options={TAG_OPTIONS} />
          <FormInput
            name="date"
            label="Date"
            placeholder="dd/mm/yyyy"
            type="date"
            style={inputStyle}
          />
        </div>

        {/* Row 6: Photos + Description */}
        <div className="grid grid-cols-2 gap-4">
          <FormImageUpload name="photos" label="Add Photos" optional />
          <FormTextarea
            name="description"
            label="Description"
            placeholder="Enter Description..."
          />
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full border-brand-200 text-brand-400 hover:bg-brand-50 hover:text-brand-500 font-semibold"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 rounded-full bg-brand-400 hover:bg-brand-500 text-white font-semibold border-0"
          >
            Submit gift
          </Button>
        </div>
      </FormWrapper>
    </div>
  );
}
