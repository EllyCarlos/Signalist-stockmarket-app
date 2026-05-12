import { WATCHLIST_TABLE_HEADER } from "@/lib/constants"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const rows = [
  ["Apple Inc.", "AAPL", "$189.84", "+1.24%", "$2.93T", "29.14", "Price > $190", "Added"],
  ["Microsoft", "MSFT", "$421.32", "+0.88%", "$3.13T", "36.08", "Price > $425", "Added"],
  ["NVIDIA", "NVDA", "$117.49", "-0.42%", "$2.89T", "64.21", "Price < $115", "Added"],
]

const WatchlistTable = () => {
  return (
    <Table className="watchlist-table">
      <TableHeader>
        <TableRow className="table-header-row">
          {WATCHLIST_TABLE_HEADER.map((header) => (
            <TableHead key={header} className="table-header text-left">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row[1]} className="table-row">
            {row.map((cell) => (
              <TableCell key={`${row[1]}-${cell}`} className="table-cell text-left">
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
