import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import { StyledTableContainer } from "./InstanceFillComponents.styles";

interface CheckboxGridInputProps {
  rows: string[];
  choices: string[];
  value?: Record<string, number[]>;
  onChange: (value: Record<string, number[]>) => void;
  disabled?: boolean;
}

export const CheckboxGridInput = ({
  rows,
  choices,
  value = {},
  onChange,
  disabled,
}: CheckboxGridInputProps) => {
  const handleCheckboxSelect = (row: string, colIdx: number, checked: boolean) => {
    const currentRow = value[row] || [];
    const nextRow = checked
      ? [...currentRow, colIdx]
      : currentRow.filter((c) => c !== colIdx);

    onChange({
      ...value,
      [row]: nextRow,
    });
  };

  return (
    <StyledTableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            {choices.map((choice, colIdx) => (
              <TableCell key={`${choice}-${colIdx}`} align="center">
                {choice}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIdx) => {
            const currentRow = value[row] || [];
            return (
              <TableRow key={`${row}-${rowIdx}`}>
                <TableCell component="th">{row}</TableCell>
                {choices.map((choice, colIdx) => (
                  <TableCell key={`${choice}-${colIdx}`} align="center">
                    <Checkbox
                      checked={currentRow.includes(colIdx)}
                      onChange={(e) =>
                        handleCheckboxSelect(row, colIdx, e.target.checked)
                      }
                      disabled={disabled}
                    />
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
