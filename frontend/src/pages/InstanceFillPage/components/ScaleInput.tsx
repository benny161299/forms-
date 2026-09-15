import { RadioGroup, Radio } from "@mui/material";
import * as S from "./InstanceFillComponents.styles";

interface ScaleInputProps {
  min: number;
  max: number;
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function ScaleInput({ min, max, value, onChange, disabled }: ScaleInputProps) {
  const numbers: number[] = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }

  return (
    <S.ScaleContainer>
      <S.ScaleLabel>{min}</S.ScaleLabel>

      <RadioGroup
        row
        value={value !== undefined ? String(value) : ""}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {numbers.map((num) => (
          <S.ScaleFormControlLabel
            key={num}
            value={String(num)}
            control={<Radio />}
            label={String(num)}
            labelPlacement="bottom"
            disabled={disabled}
          />
        ))}
      </RadioGroup>

      <S.ScaleLabel>{max}</S.ScaleLabel>
    </S.ScaleContainer>
  );
}