import { WATCHLIST_TABLE_HEADER } from "@/lib/constants"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type WatchlistTableProps = {
  rows?: Array<[string, string, string, string, string, string, string, string]>
}

const WatchlistTable = ({ rows = [] }: WatchlistTableProps) => {
  return (
    <Table className="watchlist-table">
      <TableHeader>
        <TableRow className="table-header-row">
          {WATCHLIST_TABLE_HEADER.map((header) => (
            <TableHead key={header} scope="col" className="table-header text-left">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={row[1]} className="table-row">
            {row.map((cell, cellIndex) => (
              <TableCell key={`${rowIndex}-${cellIndex}`} className="table-cell text-left">
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default WatchlistTable
