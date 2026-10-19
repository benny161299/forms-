import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { ScaleRow } from "./SchemaBuilder.styles";

const MIN_OPTIONS = [0, 1] as const;
const MAX_OPTIONS = [5, 6, 7, 8, 9, 10] as const;

interface ScaleRangeSelectorProps {
  min: number;
  max: number;
  onUpdate: (min: number, max: number) => void;
}

export const ScaleRangeSelector = ({ min, max, onUpdate }: ScaleRangeSelectorProps) => {
  return (
    <ScaleRow>
      <FormControl size="small">
        <InputLabel>min</InputLabel>
        <Select
          value={min}
          label="min"
          onChange={(e) => onUpdate(Number(e.target.value), max)}
        >
          {MIN_OPTIONS.map((val) => (
            <MenuItem key={val} value={val}>
              {val}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small">
        <InputLabel>max</InputLabel>
        <Select
          value={max}
          label="max"
          onChange={(e) => onUpdate(min, Number(e.target.value))}
        >
          {MAX_OPTIONS.map((val) => (
            <MenuItem key={val} value={val}>
              {val}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ScaleRow>
  );
};
