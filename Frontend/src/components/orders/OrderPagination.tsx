import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import type { PagyMeta } from "../../types/PagyType";

interface OrderPaginationProps {
  meta?: PagyMeta;
  currentPage: number;
  limit: number;
  totalItemsFallback: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
}

export function OrderPagination({
  meta,
  currentPage,
  limit,
  totalItemsFallback,
  onPageChange,
}: OrderPaginationProps) {
  const { t } = useTranslation();

  if (!meta) return null;

  const page = Number(meta.page ?? currentPage);
  const totalCount = Number(meta.count ?? meta.total ?? totalItemsFallback);

  // Fallback calculation in case backend doesn't send total page count explicitly
  const calculatedPages = Math.ceil(totalCount / limit) || 1;
  const totalPages = Number(
    meta.pages ?? meta.total_pages ?? (meta as any).last ?? calculatedPages
  );

  const from = meta.from ?? (page - 1) * limit + 1;
  const to = meta.to ?? Math.min(page * limit, totalCount);

  const hasNext =
    meta.next !== undefined && meta.next !== null
      ? Boolean(meta.next)
      : page < totalPages;

  const hasPrev =
    meta.prev !== undefined && meta.prev !== null
      ? Boolean(meta.prev)
      : page > 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
      <span className="text-sm text-muted">
        {t("orders.pagination.showingResults", {
          defaultValue: "Showing {{from}} to {{to}} of {{total}} orders",
          from,
          to,
          total: totalCount,
        })}
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
          disabled={!hasPrev}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("orders.pagination.prev", { defaultValue: "Previous" })}
          </span>
        </Button>

        <span className="text-sm font-medium px-2">
          {t("orders.pagination.pageInfo", {
            defaultValue: "Page {{page}} of {{totalPages}}",
            page,
            totalPages,
          })}
        </span>

        <Button
          variant="outline"
          onClick={() => onPageChange((prev) => prev + 1)}
          disabled={!hasNext}
        >
          <span className="flex items-center gap-1.5">
            {t("orders.pagination.next", { defaultValue: "Next" })}
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Button>
      </div>
    </div>
  );
}