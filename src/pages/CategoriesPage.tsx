import { useState } from "react";
import { Plus, Trash2, Edit2, Folder, Tag as TagIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<"category" | "subcategory" | "tag">("category");

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {(["category", "subcategory", "tag"] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
            className="capitalize rounded-full"
          >
            {tab}s
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="capitalize">{activeTab} Management</CardTitle>
          <Button className="gap-2 rounded-full">
            <Plus className="w-4 h-4" /> Add New {activeTab}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  {activeTab === "tag" ? <TagIcon className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                  Sample {activeTab}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">Active</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-brand-500"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
