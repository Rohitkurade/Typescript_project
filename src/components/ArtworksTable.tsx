import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import type { DataTablePageEvent } from "primereact/datatable";
import type { Artwork } from "../types/artwork";
import { fetchArtworks } from "../services/api";

const ROWS_PER_PAGE = 12;

export default function ArtworksTable() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Persistent selection storage
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Custom select state
  const [customCount, setCustomCount] = useState<number | null>(null);
  const overlayRef = useRef<OverlayPanel>(null);

  useEffect(() => {
    loadData(page);
  }, [page]);

  const loadData = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await fetchArtworks(pageNumber);

      setArtworks(response.data);
      setTotalRecords(response.pagination.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (event: DataTablePageEvent) => {
    const newPage = event.page + 1;
    setPage(newPage);
  };

  const handleCustomSelect = () => {
    if (!customCount || customCount <= 0) return;

    const idsToSelect = artworks
      .slice(0, customCount)
      .map((a) => a.id);

    setSelectedIds((prev) => {
      const updated = new Set(prev);
      idsToSelect.forEach((id) => updated.add(id));
      return updated;
    });

    overlayRef.current?.hide();
  };

  const currentPageSelection = artworks.filter((a) =>
    selectedIds.has(a.id)
  );

  return (
    <div>
        <p style={{ marginBottom: "0.5rem" }}>
  Total Selected: {selectedIds.size}
</p>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h3>Artworks</h3>
        <Button
          icon="pi pi-check-square"
          label="Select Rows"
          onClick={(e) => overlayRef.current?.toggle(e)}
        />
      </div>

      {/* Overlay Panel */}
      <OverlayPanel ref={overlayRef}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <InputNumber
            value={customCount}
            onValueChange={(e) => setCustomCount(e.value ?? null)}
            min={1}
            placeholder="Enter count"
          />
          <Button label="Apply" onClick={handleCustomSelect} />
        </div>
      </OverlayPanel>

      {/* Data Table */}
      <DataTable
        value={artworks}
        lazy
        paginator
        rows={ROWS_PER_PAGE}
        totalRecords={totalRecords}
        first={(page - 1) * ROWS_PER_PAGE}
        onPage={onPageChange}
        loading={loading}
        selectionMode="checkbox"
        selection={currentPageSelection}
        onSelectionChange={(e) => {
          const currentPageIds = artworks.map((a) => a.id);

          setSelectedIds((prev) => {
            const updated = new Set(prev);

            currentPageIds.forEach((id) => updated.delete(id));

            e.value.forEach((row: Artwork) => updated.add(row.id));

            return updated;
          });
        }}
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
}