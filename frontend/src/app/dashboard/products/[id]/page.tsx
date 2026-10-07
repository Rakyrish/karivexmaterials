"use client";

import { use } from "react";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { PhotoManager } from "@/components/dashboard/PhotoManager";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { RowsEditor } from "@/components/dashboard/RowsEditor";
import { productSections } from "@/lib/dashboard-resources";

const AVAILABILITY: [string, string][] = [
  ["unknown", "On enquiry"],
  ["in_stock", "In stock"],
  ["on_order", "On order"],
];

export default function ProductEditPage({ params }: PageProps<"/dashboard/products/[id]">) {
  const { id } = use(params);
  const { can } = useDashboard();
  const canEdit = id === "new" ? can("catalog.add_product") : can("catalog.change_product");
  const canPublish = can("catalog.publish_product");

  return (
    <ResourceForm
      endpoint="products"
      id={id}
      title={(v) => (id === "new" ? "Add a product" : String(v.name || "Product"))}
      description={
        id === "new"
          ? canPublish
            ? "Fill in the basics and create the product, then add photos, sizes and specifications."
            : "New products start as drafts. An administrator publishes them after review."
          : undefined
      }
      sections={productSections(canPublish)}
      defaults={{ status: "draft", availability_status: "unknown", price_currency: "KES", order: 0 }}
      listHref="/dashboard/products"
      listLabel="All products"
      publicPath={(v) => (v.status === "published" ? `/products/${v.slug}` : null)}
      canEdit={canEdit}
      canDelete={can("catalog.delete_product")}
      extrasFirst
      deleteWarning="Delete this product and its photos permanently? To take it off the site but keep it, set Visibility to Hidden instead."
    >
      {(record, reload) => (
        <div className="space-y-6">
          <PhotoManager
            productId={record.id as number}
            productName={String(record.name)}
            photos={record.images as never}
            onChange={reload}
            canAdd={can("catalog.add_productimage")}
            canChange={can("catalog.change_productimage")}
            canDelete={can("catalog.delete_productimage")}
          />
          <RowsEditor
            key={`variants-${JSON.stringify(record.variants)}`}
            title="Sizes & options"
            description="Each option a buyer can choose when requesting a quote, e.g. a brick size or bag weight."
            productId={record.id as number}
            field="variants"
            initial={record.variants as never}
            blank={{ label: "", dimensions: "", thickness: "", pack_size: "", availability_status: "unknown", is_active: true }}
            columns={[
              { name: "label", label: "Option", placeholder: "Standard 230 × 114 × 76 mm" },
              { name: "dimensions", label: "Dimensions" },
              { name: "thickness", label: "Thickness" },
              { name: "pack_size", label: "Pack size" },
              { name: "availability_status", label: "Availability", type: "select", options: AVAILABILITY },
              { name: "is_active", label: "Shown", type: "checkbox" },
            ]}
            canEdit={can("catalog.change_product")}
            onSaved={reload}
            addLabel="Add option"
          />
          <RowsEditor
            key={`specs-${JSON.stringify(record.specifications)}`}
            title="Specifications"
            description="Confirmed facts only, with units. Shown as a table on the product page."
            productId={record.id as number}
            field="specifications"
            initial={record.specifications as never}
            blank={{ label: "", value: "", unit: "" }}
            columns={[
              { name: "label", label: "Property", placeholder: "Material" },
              { name: "value", label: "Value", placeholder: "Stainless steel" },
              { name: "unit", label: "Unit", placeholder: "mm", width: "w-28" },
            ]}
            canEdit={can("catalog.change_product")}
            onSaved={reload}
            addLabel="Add specification"
          />
        </div>
      )}
    </ResourceForm>
  );
}
