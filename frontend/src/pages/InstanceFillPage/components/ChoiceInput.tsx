import {
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { QuestionType } from "../../../types/schema.types";

type ChoiceQuestionType = Extract<
  QuestionType,
  "radio" | "checkbox" | "dropdown"
>;

interface ChoiceInputProps {
  type: ChoiceQuestionType;
  id: string;
  choices: string[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
}

export function ChoiceInput({
  type,
  id,
  choices,
  value,
  onChange,
  disabled,
}: ChoiceInputProps) {
  const { t } = useTranslation();

  switch (type) {
    case "radio":
      return (
        <RadioGroup
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {choices.map((choice) => (
            <FormControlLabel
              key={choice}
              value={choice}
              control={<Radio />}
              label={choice}
              disabled={disabled}
            />
          ))}
        </RadioGroup>
      );

    case "checkbox": {
      const list = Array.isArray(value) ? value : [];
      return (
        <FormGroup>
          {choices.map((choice) => (
            <FormControlLabel
              key={choice}
              control={
                <Checkbox
                  checked={list.includes(choice)}
                  onChange={(e) =>
                    onChange(
                      e.target.checked
                        ? [...list, choice]
                        : list.filter((i) => i !== choice)
                    )
                  }
                  disabled={disabled}
                />
              }
              label={choice}
            />
          ))}
        </FormGroup>
      );
    }

    case "dropdown":
      return (
        <FormControl fullWidth variant="outlined">
          <InputLabel id={`label-${id}`}>
            {t("instanceFill.selectOption")}
          </InputLabel>
          <Select
            labelId={`label-${id}`}
            label={t("instanceFill.selectOption")}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          >
            {choices.map((choice) => (
              <MenuItem key={choice} value={choice}>
                {choice}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
  }
}