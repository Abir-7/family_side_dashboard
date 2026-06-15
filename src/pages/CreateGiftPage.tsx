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
import { useCreateGiftMutation } from "@/lib/redux/apis/giftApi";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const schema = z.object({
  location: z.string().min(1, "Location is required"),
  giftName: z.string().min(1, "Gift name is required"),
  whatsapp: z.string().min(1, "WhatsApp number is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  instagram: z.string().optional(),
  subCategory: z.array(z.string()).min(1, "Select at least one sub-category"),
  email: z.string().optional(),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
  date: z.string().min(1, "Date is required"),
  photos: z.array(z.any()).optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [createGift, { isLoading }] = useCreateGiftMutation();

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
    formData.append("name", data.giftName);
    formData.append("location", data.location);
    formData.append("category_id", data.category);
    formData.append("price", data.price);
    formData.append("description", data.description || "");
    formData.append("opening_days", data.date);
    formData.append("sub_categories", data.subCategory.join(","));
    formData.append("tags", data.tags.join(","));
    if (data.photos && data.photos.length > 0) {
      formData.append("photo", data.photos[0]);
    }
    formData.append("whatsapp", data.whatsapp);
    if (data.instagram) formData.append("instagram", data.instagram);
    if (data.email) formData.append("email", data.email);
    formData.append("date", data.date);

    try {
        await createGift(formData).unwrap();
        toast.success("Gift created successfully");
        navigate("/dashboard/gifts");
    } catch (error: any) {
        toast.error(error.data?.message || "Failed to create gift");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mx-auto">
      <FormWrapper
        schema={schema}
        onSubmit={onSubmit}
        defaultValues={{
          subCategory: [],
          tags: [],
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
            options={categoryOptions}
            onChange={(val) => {
                setSelectedCategory(Number(val));
              }}
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
            options={subCategoryOptions}
            disabledText={!selectedCategory ? "Select a category first" : "No sub-categories found"}
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
          <FormPillGroup name="tags" label="Tag" options={tagOptions} />
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
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit gift
          </Button>
        </div>
      </FormWrapper>
    </div>
  );
}
