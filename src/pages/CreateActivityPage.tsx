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
import { useGetAllCategoriesQuery, useGetAllSubCategoriesQuery } from "@/lib/redux/apis/categoryApi";
import { useGetAllTagsQuery } from "@/lib/redux/apis/tagApi";
import { useCreateActivityMutation } from "@/lib/redux/apis/activityApi";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

export default function CreateActivityPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [createActivity, { isLoading }] = useCreateActivityMutation();

  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const { data: subCategoriesResponse } = useGetAllSubCategoriesQuery(selectedCategory!, { skip: !selectedCategory });
  const { data: tagsResponse } = useGetAllTagsQuery();

  const categoryOptions = categoriesResponse?.data?.map((cat: any) => ({
    label: cat.name,
    value: cat.id.toString(),
  })) || [];

  const subCategoryOptions = subCategoriesResponse?.data?.map((sub: any) => sub.name) || [];
  const tagOptions = tagsResponse?.data?.map((tag: any) => tag.name) || [];

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.activityName);
    formData.append("location", data.location);
    formData.append("category_id", data.category);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("opening_days", data.openingDays);
    formData.append("sub_categories", data.subCategory.join(","));
    formData.append("tags", data.tags.join(","));
    if (data.photos && data.photos.length > 0) {
      formData.append("image_url", data.photos[0]);
    }
    if (data.website) formData.append("website", data.website);
    formData.append("whatsapp", data.whatsapp);
    formData.append("email", data.email);
    if (data.instagram) formData.append("instagram", data.instagram);
    formData.append("opening_hours", data.openingHours);

    try {
        await createActivity(formData).unwrap();
        toast.success("Activity created successfully");
        navigate("/dashboard/activity");
    } catch (error: any) {
        toast.error(error.data?.message || "Failed to create activity");
    }
  };

  return (
    <div className=" mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <FormWrapper
        schema={schema}
        onSubmit={onSubmit}
        defaultValues={{
          subCategory: [],
          tags: [],
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
            options={categoryOptions}
            onChange={(val) => {
              setSelectedCategory(Number(val));
            }}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4">
          <FormPillGroup
            name="subCategory"
            label="Sub-category"
            options={subCategoryOptions}
            disabledText={!selectedCategory ? "Select a category first" : "No sub-categories found"}
          />
          <FormPillGroup name="tags" label="Tag" options={tagOptions} />
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
            className="h-11 rounded-full border-brand-200 text-brand-400 hover:bg-brand-50 hover:text-brand-500 font-semibold"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 rounded-full bg-brand-400 hover:bg-brand-500 text-white font-semibold border-0"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit activity
          </Button>
        </div>
      </FormWrapper>
    </div>
  );
}
