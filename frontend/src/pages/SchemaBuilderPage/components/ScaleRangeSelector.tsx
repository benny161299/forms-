import React, { useId } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ScaleRow } from "./SchemaBuilder.styles";

const MIN_OPTIONS = [0, 1] as const;
const MAX_OPTIONS = [5, 6, 7, 8, 9, 10] as const;

interface ScaleRangeSelectorProps {
  min: number;
  max: number;
  onUpdate: (min: number, max: number) => void;
}

export const ScaleRangeSelector = React.memo(({ min, max, onUpdate }: ScaleRangeSelectorProps) => {
  const { t } = useTranslation();
  const minLabelId = useId();
  const maxLabelId = useId();

  return (
    <ScaleRow>
      <FormControl size="small">
        <InputLabel id={minLabelId}>
          {t("schemaBuilder.scaleMin")}
        </InputLabel>
        <Select
          labelId={minLabelId}
          value={min}
          label={t("schemaBuilder.scaleMin")}
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
        <InputLabel id={maxLabelId}>
          {t("schemaBuilder.scaleMax")}
        </InputLabel>
        <Select
          labelId={maxLabelId}
          value={max}
          label={t("schemaBuilder.scaleMax")}
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
});
