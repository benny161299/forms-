import { RadioGroup, Radio } from "@mui/material";
import {
  ScaleContainer,
  ScaleFormControlLabel,
  ScaleLabel,
} from "./InstanceFillComponents.styles";

interface ScaleInputProps {
  min: number;
  max: number;
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const ScaleInput = ({ min, max, value, onChange, disabled }: ScaleInputProps) => {
  return (
    <ScaleContainer>
      <ScaleLabel>{min}</ScaleLabel>

      <RadioGroup
        row
        value={value !== undefined ? String(value) : ""}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {Array.from({ length: max - min + 1 }, (_, index) => index + min).map((num) => (
          <ScaleFormControlLabel
            key={num}
            value={String(num)}
            control={<Radio />}
            label={String(num)}
            labelPlacement="bottom"
            disabled={disabled}
          />
        ))}
      </RadioGroup>

      <ScaleLabel>{max}</ScaleLabel>
    </ScaleContainer>
  );
};