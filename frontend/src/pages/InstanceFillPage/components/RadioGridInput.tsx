import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Radio,
} from "@mui/material";
import { StyledTableContainer } from "./InstanceFillComponents.styles";

interface RadioGridInputProps {
  rows: string[];
  choices: string[];
  value?: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
  disabled?: boolean;
}

export const RadioGridInput = ({
  rows,
  choices,
  value = {},
  onChange,
  disabled,
}: RadioGridInputProps) => {
  const handleRadioSelect = (row: string, colIdx: number) => {
    onChange({
      ...value,
      [row]: colIdx,
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
          {rows.map((row, rowIdx) => (
            <TableRow key={`${row}-${rowIdx}`}>
              <TableCell component="th">{row}</TableCell>
              {choices.map((choice, colIdx) => (
                <TableCell key={`${choice}-${colIdx}`} align="center">
                  <Radio
                    checked={value[row] === colIdx}
                    onChange={() => handleRadioSelect(row, colIdx)}
                    disabled={disabled}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}