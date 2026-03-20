import { type ClassValue } from "clsx";
import { useState } from "react";
import { cn } from "../lib/utils";

type TableProps = {
  classNames?: {
    root?: ClassValue;
    header?: ClassValue;
    body?: ClassValue;
    row?: ClassValue;
    cell?: ClassValue;
  };
  headers: {
    id?: string | number;
    className?: ClassValue;
    render: React.ReactNode;
  }[];
  selectable?: boolean;
  selectableClassName?: ClassValue;
  selectedRows?: (number | string)[];
  setSelectedRows?: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  selectionDisabled?: (number | string)[];
  selectionDisabledRender?: React.ReactNode;
  rows: {
    id: string | number;
    className?: ClassValue;
    disabled?: boolean;
    cells: {
      render: React.ReactNode | string | number;
      className?: ClassValue;
      disabled?: boolean;
    }[];
  }[];
};

export default function Table({
  headers,
  rows,
  classNames,
  selectable = false,
  selectableClassName,
  selectedRows,
  setSelectedRows,
  selectionDisabled,
  selectionDisabledRender,
}: TableProps) {
  const [_selectedRows, _setSelectedRows] = useState<
    TableProps["rows"][number]["id"][]
  >([]);

  const allRows = [
    ...(selectedRows ? selectedRows : _selectedRows).map(
      (row) => rows.find((r) => r.id === row)!,
    ),
    ...(rows
      ? rows.filter(
          (row) =>
            !(selectedRows ? selectedRows : _selectedRows).includes(row.id),
        )
      : []),
  ];

  return (
    <table
      className={cn(
        "w-full relative border-collapse border border-gray-200 rounded-lg overflow-hidden",
        classNames?.root,
      )}
    >
      <thead className={cn("bg-gray-200", classNames?.header)}>
        <tr className="border">
          {selectable && (
            <th
              className={cn("p-2 text-center font-medium", selectableClassName)}
            >
              Select
            </th>
          )}
          {headers.map((header) => (
            <th
              key={header.id ?? Math.random()}
              className={cn("p-2 text-center font-medium", header.className)}
            >
              {header.render}
            </th>
          ))}
        </tr>
      </thead>
      {allRows.length > 0 ? (
        <tbody className={cn(classNames?.body)}>
          {allRows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                "border-b border-gray-300",
                classNames?.row,
                row.disabled
                  ? "opacity-50 pointer-events-none select-none"
                  : "",
              )}
            >
              {selectable && (
                <td className={cn("p-2 text-center", selectableClassName)}>
                  {selectionDisabled?.includes(row.id) &&
                  selectionDisabledRender ? (
                    selectionDisabledRender
                  ) : (
                    <label
                      className={cn(
                        "flex items-center justify-center cursor-pointer",
                        {
                          "opacity-30 pointer-events-none select-none cursor-not-allowed":
                            selectionDisabled?.includes(row.id),
                        },
                      )}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer"
                        checked={(selectedRows
                          ? selectedRows
                          : _selectedRows
                        ).includes(row.id)}
                        onChange={() =>
                          setSelectedRows
                            ? setSelectedRows((selectedRows) => {
                                const alreadySelected = selectedRows.includes(
                                  row.id,
                                );
                                if (alreadySelected) {
                                  return selectedRows.filter(
                                    (r) => r !== row.id,
                                  );
                                }
                                return [...selectedRows, row.id];
                              })
                            : _setSelectedRows((selectedRows) => {
                                const alreadySelected = selectedRows.includes(
                                  row.id,
                                );
                                if (alreadySelected) {
                                  return selectedRows.filter(
                                    (r) => r !== row.id,
                                  );
                                }
                                return [...selectedRows, row.id];
                              })
                        }
                      />
                    </label>
                  )}
                </td>
              )}
              {row.cells.map((cell, i) => (
                <td
                  key={row.id + "-" + i}
                  className={cn(
                    "p-2 text-center",
                    cell.className,
                    cell.disabled
                      ? "opacity-50 pointer-events-none select-none"
                      : "",
                  )}
                >
                  {cell.render}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td colSpan={headers.length + (selectable ? 1 : 0)} className="py-8 text-center">
              <div className="italic text-gray-400">
                No data
              </div>
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
}
