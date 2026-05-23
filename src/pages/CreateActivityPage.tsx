import { ArrowLeft } from "lucide-react";
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
  activityName: z.string().min(1, "Activity name is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.array(z.string()).min(1, "Select at least one sub-category"),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
  price: z.string().min(1, "Price is required"),
  website: z.string().optional(),
  whatsapp: z.string().min(1, "WhatsApp number is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  instagram: z.string().optional(),
  openingDays: z.string().min(1, "Opening days are required"),
  openingHours: z.string().min(1, "Opening hours are required"),
  photos: z.array(z.any()).optional(),
  description: z.string().min(1, "Description is required"),
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

export default function CreateActivityPage() {
  const navigate = useNavigate();

  const onSubmit = (data: FormValues) => {
    console.log("Submitted:", data);
  };

  return (
    <div className=" mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <FormWrapper
        schema={schema}
        onSubmit={onSubmit}
        defaultValues={{
          subCategory: ["All"],
          tags: ["Toddler"],
          photos: [],
        }}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        {/* Location */}
        <FormLocationSearch name="location" placeholder="Enter your location" />

        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="activityName"
            label="Activity Name"
            placeholder="Enter your activity name..."
            style={{
              borderRadius: "10px",
              padding: "9px 14px",
              border: "1.5px solid #e0e0e0",
              fontSize: "14px",
              background: "#fafafa",
              outline: "none",
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <FormSelect
            name="category"
            label="Category"
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4">
          <FormPillGroup
            name="subCategory"
            label="Sub-category"
            options={SUBCATEGORY_OPTIONS}
          />
          <FormPillGroup name="tags" label="Tag" options={TAG_OPTIONS} />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="price"
            label="Activity Price *"
            placeholder="$00"
            style={{
              borderRadius: "10px",
              padding: "9px 14px",
              border: "1.5px solid #e0e0e0",
              fontSize: "14px",
              background: "#fafafa",
              outline: "none",
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <FormInput
            name="website"
            label="Website"
            placeholder="Enter website link"
            style={{
              borderRadius: "10px",
              padding: "9px 14px",
              border: "1.5px solid #e0e0e0",
              fontSize: "14px",
              background: "#fafafa",
              outline: "none",
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="whatsapp"
            label="What's App Number"
            placeholder="Enter phone number..."
            style={{
              borderRadius: "10px",
              padding: "9px 14px",
              border: "1.5px solid #e0e0e0",
              fontSize: "14px",
              background: "#fafafa",
              outline: "none",
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <FormInput
            name="email"
            label="Email"
            placeholder="Enter email..."
            style={{
              borderRadius: "10px",
              padding: "9px 14px",
              border: "1.5px solid #e0e0e0",
              fontSize: "14px",
              background: "#fafafa",
              outline: "none",
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            name="instagram"
            label="Instagram Link"
            placeholder="Enter instagram link..."
            style={{
              borderRadius: "10px",
              padding: "9px 14px",
              border: "1.5px solid #e0e0e0",
              fontSize: "14px",
              background: "#fafafa",
              outline: "none",
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <FormInput
            name="openingDays"
            label="Opening Days"
            placeholder="10:00 AM to 09:00 PM"
            style={{
              borderRadius: "10px",
              padding: "9px 14px",
              border: "1.5px solid #e0e0e0",
              fontSize: "14px",
              background: "#fafafa",
              outline: "none",
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <FormInput
            name="openingHours"
            label="Opening Hours"
            placeholder="10:00 AM to 09:00 PM"
            style={{
              borderRadius: "10px",
              padding: "9px 14px",
              border: "1.5px solid #e0e0e0",
              fontSize: "14px",
              background: "#fafafa",
              outline: "none",
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Row 6 */}
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
            className="h-11 rounded-xl border-rose-200 text-rose-400 hover:bg-rose-50 hover:text-rose-500 font-semibold"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 rounded-xl bg-rose-400 hover:bg-rose-500 text-white font-semibold border-0"
          >
            Submit activity
          </Button>
        </div>
      </FormWrapper>
    </div>
  );
}
