import { TextField, IconButton, Button } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import * as S from "./SchemaBuilder.styles";

interface EditableItemListProps {
  items: string[];
  placeholderKey: string;
  addLabelKey: string;
  onUpdate: (updatedItems: string[]) => void;
}

export function EditableItemList({
  items,
  placeholderKey,
  addLabelKey,
  onUpdate,
}: EditableItemListProps) {
  const { t } = useTranslation();

  const handleItemChange = (index: number, val: string) => {
    const list = [...items];
    list[index] = val;
    onUpdate(list);
  };

  const handleAddItem = () => {
    onUpdate([...items, ""]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    onUpdate(items.filter((_, i) => i !== index));
  };

  return (
    <S.OptionsList>
      {items.map((item, index) => (
        <S.OptionItem key={index}>
          <TextField
            size="small"
            fullWidth
            placeholder={t(placeholderKey, { number: index + 1 })}
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
          />
          <IconButton size="small" onClick={() => handleRemoveItem(index)}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </S.OptionItem>
      ))}

      <Button size="small" startIcon={<AddIcon />} onClick={handleAddItem}>
        {t(addLabelKey)}
      </Button>
    </S.OptionsList>
  );
}